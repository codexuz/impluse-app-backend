import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  CreateAudioDto,
  CreateTaskDto,
  CreateCommentDto,
  CreateJudgeDto,
} from "./dto/create-audio-barrel.dto.js";
import { UpdateAudioDto } from "./dto/update-audio.dto.js";
import { Audio } from "./entities/audio.entity.js";
import { AudioTask } from "./entities/audio-task.entity.js";
import { AudioLike } from "./entities/likes.js";
import { AudioComment } from "./entities/comments.js";
import { AudioJudge } from "./entities/judge.js";
import { Course } from "../courses/entities/course.entity.js";
import { Op } from "sequelize";
import { REWARDS, NotificationType } from "./constants/rewards.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";
import { FirebaseServiceService } from "../notifications/firebase-service.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { User } from "../users/entities/user.entity.js";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";
import * as path from "path";
import * as fs from "fs/promises";
import { existsSync } from "fs";

@Injectable()
export class AudioService {
  constructor(
    @InjectModel(Audio)
    private audioModel: typeof Audio,
    @InjectModel(AudioTask)
    private audioTaskModel: typeof AudioTask,
    @InjectModel(AudioLike)
    private audioLikeModel: typeof AudioLike,
    @InjectModel(AudioComment)
    private audioCommentModel: typeof AudioComment,
    @InjectModel(AudioJudge)
    private audioJudgeModel: typeof AudioJudge,
    @InjectModel(NotificationToken)
    private notificationTokenModel: typeof NotificationToken,
    @InjectModel(User)
    private userModel: typeof User,
    private studentProfileService: StudentProfileService,
    private firebaseService: FirebaseServiceService,
    private eventEmitter: EventEmitter2,
    private awsStorageService: AwsStorageService,
  ) {}

  // ========== TASK MANAGEMENT (Admin) ==========
  async createTask(createTaskDto: CreateTaskDto, adminId: string) {
    const task = await this.audioTaskModel.create({
      ...createTaskDto,
      createdBy: adminId,
    });
    return task;
  }

  async getAllTasks(
    page: number = 1,
    limit: number = 20,
    status?: string,
    difficulty?: string,
  ) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const tasks = await this.audioTaskModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const total = await this.audioTaskModel.count({ where });

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(taskId: number) {
    const task = await this.audioTaskModel.findByPk(taskId);
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async isTaskDoneByUser(taskId: number, userId: string): Promise<boolean> {
    // Check if user has submitted an audio for this task
    const submission = await this.audioModel.findOne({
      where: {
        taskId,
        studentId: userId,
        status: {
          [Op.in]: ["completed", "processing"], // Consider both completed and processing as done
        },
      },
    });

    return !!submission; // Returns true if submission exists, false otherwise
  }

  async updateTask(taskId: number, updateData: Partial<CreateTaskDto>) {
    const task = await this.getTaskById(taskId);
    await task.update(updateData);
    return task;
  }

  // ========== AUDIO MANAGEMENT (Student) ==========
  async uploadAudio(
    file: Express.Multer.File,
    createAudioDto: CreateAudioDto,
    studentId: string,
  ) {
    try {
      // Upload audio directly to AWS S3
      const objectName = `audios/${Date.now()}_${file.originalname}`;
      const fileBuffer = await fs.readFile(file.path);
      await this.awsStorageService.uploadBuffer(
        "speakup",
        objectName,
        fileBuffer,
        file.mimetype,
      );

      // Generate presigned URL (valid for 7 days)
      const presignedUrl = await this.awsStorageService.getPresignedUrl(
        "speakup",
        objectName,
        7 * 24 * 60 * 60, // 7 days
      );

      // Create audio record with completed status
      const audio = await this.audioModel.create({
        taskId: createAudioDto.taskId,
        caption: createAudioDto.caption,
        durationSeconds: createAudioDto.durationSeconds,
        audioUrl: presignedUrl,
        studentId,
        status: "completed",
      });

      // Clean up temporary file
      try {
        if (existsSync(file.path)) {
          await fs.unlink(file.path);
        }
      } catch (error) {
        console.error("Error cleaning up temp file:", error);
      }

      // Increment task submission count if taskId provided
      if (createAudioDto.taskId) {
        await this.audioTaskModel.increment("submissionCount", {
          where: { id: createAudioDto.taskId },
        });
      }

      // Reward user for successful audio upload
      await this.rewardUser(
        studentId,
        REWARDS.VIDEO_UPLOAD.coins,
        REWARDS.VIDEO_UPLOAD.points,
      );

      // Update streak
      await this.updateStreak(studentId);

      // Send notifications after audio upload is complete
      await this.notifyNewAudioUpload(studentId, audio.id);

      return {
        audioId: audio.id,
        status: "completed",
        message: "Audio uploaded successfully",
      };
    } catch (error) {
      // Clean up temporary file on error
      try {
        if (existsSync(file.path)) {
          await fs.unlink(file.path);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up temp file:", cleanupError);
      }
      throw error;
    }
  }

  async getAudioById(audioId: number) {
    // Validate audioId parameter
    if (
      !audioId ||
      isNaN(audioId) ||
      !Number.isInteger(audioId) ||
      audioId <= 0
    ) {
      throw new BadRequestException("Invalid audio ID provided");
    }

    const audio = await this.audioModel.findByPk(audioId, {
      include: [
        { model: AudioTask, as: "task" },
        { model: AudioLike, as: "likes" },
        { model: AudioComment, as: "comments" },
        { model: AudioJudge, as: "judges" },
      ],
    });
    if (!audio) throw new NotFoundException("Audio not found");
    return audio;
  }

  async getMyAudios(studentId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const audios = await this.audioModel.findAll({
      where: { studentId, status: "completed" },
      include: [
        { model: AudioTask, as: "task" },
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "avatar_url",
            "level_id",
          ],
          include: [
            {
              model: Course,
              as: "level",
              attributes: ["id", "title", "level"],
            },
          ],
        },
      ],
      order: [
        ["trendingScore", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    // Process audios with fresh URLs in batches to handle large datasets
    const audiosWithFreshUrls = await this.processAudiosWithFreshUrls(audios);

    // Check if user has liked and judged each audio
    const audioIds = audiosWithFreshUrls.map((v) => v.id);

    // Fetch user likes and judges in parallel
    const [userLikes, userJudges] = await Promise.all([
      this.audioLikeModel.findAll({
        where: {
          audioId: audioIds,
          userId: studentId,
        },
        attributes: ["audioId"],
      }),
      this.audioJudgeModel.findAll({
        where: {
          audioId: audioIds,
          judgeUserId: studentId,
        },
        attributes: ["audioId"],
      }),
    ]);

    const likedAudioIds = new Set(userLikes.map((like) => like.audioId));
    const judgedAudioIds = new Set(userJudges.map((judge) => judge.audioId));

    const audiosWithStatus = audiosWithFreshUrls.map((audio) => {
      const audioJson =
        typeof audio.toJSON === "function" ? audio.toJSON() : audio;
      return {
        ...audioJson,
        isLiked: likedAudioIds.has(audio.id),
        isJudged: judgedAudioIds.has(audio.id),
      };
    });

    const total = await this.audioModel.count({
      where: { studentId, status: "completed" },
    });

    return {
      audios: audiosWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteAudio(audioId: number, studentId: string) {
    // Validate audioId parameter
    if (
      !audioId ||
      isNaN(audioId) ||
      !Number.isInteger(audioId) ||
      audioId <= 0
    ) {
      throw new BadRequestException("Invalid audio ID provided");
    }

    const audio = await this.getAudioById(audioId);
    if (audio.studentId !== studentId) {
      throw new BadRequestException("You can only delete your own audios");
    }

    // Delete the audio file from AWS S3
    if (audio.audioUrl) {
      try {
        // Extract object name from URL or use audio ID as object name
        const objectName = `audios/${audio.id}.mp3`;
        await this.awsStorageService.deleteFile("speakup", objectName);
      } catch (error) {
        console.error("Error deleting audio file from AWS S3:", error);
        // Continue with database deletion even if AWS S3 deletion fails
      }
    }

    // Delete related records
    await Promise.all([
      this.audioCommentModel.destroy({ where: { audioId } }),
      this.audioJudgeModel.destroy({ where: { audioId } }),
      this.audioLikeModel.destroy({ where: { audioId } }),
    ]);

    await audio.destroy();
    return { message: "Audio deleted successfully" };
  }

  // ========== TRENDING FEED ==========
  async getTrendingFeed(page: number = 1, limit: number = 20, userId?: string) {
    const offset = (page - 1) * limit;

    const audios = await this.audioModel.findAll({
      where: { status: "completed" },
      include: [
        { model: AudioTask, as: "task" },
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "avatar_url",
            "level_id",
          ],
          include: [
            {
              model: Course,
              as: "level",
              attributes: ["id", "title", "level"],
            },
          ],
        },
      ],
      order: [
        ["trendingScore", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    // Process audios with fresh URLs in batches to handle large datasets
    const audiosWithFreshUrls = await this.processAudiosWithFreshUrls(audios);

    // Check if user has liked and judged each audio
    let audiosWithLikeStatus: any[] = audiosWithFreshUrls;
    if (userId) {
      const audioIds = audiosWithFreshUrls.map((v) => v.id);

      // Fetch user likes and judges in parallel
      const [userLikes, userJudges] = await Promise.all([
        this.audioLikeModel.findAll({
          where: {
            audioId: audioIds,
            userId: userId,
          },
          attributes: ["audioId"],
        }),
        this.audioJudgeModel.findAll({
          where: {
            audioId: audioIds,
            judgeUserId: userId,
          },
          attributes: ["audioId"],
        }),
      ]);

      const likedAudioIds = new Set(userLikes.map((like) => like.audioId));
      const judgedAudioIds = new Set(userJudges.map((judge) => judge.audioId));

      audiosWithLikeStatus = audiosWithFreshUrls.map((audio) => {
        const audioJson =
          typeof audio.toJSON === "function" ? audio.toJSON() : audio;
        return {
          ...audioJson,
          isLiked: likedAudioIds.has(audio.id),
          isJudged: judgedAudioIds.has(audio.id),
        };
      });
    } else {
      audiosWithLikeStatus = audiosWithFreshUrls.map((audio) => {
        const audioJson =
          typeof audio.toJSON === "function" ? audio.toJSON() : audio;
        return {
          ...audioJson,
          isLiked: false,
          isJudged: false,
        };
      });
    }

    const total = await this.audioModel.count({
      where: { status: "completed" },
    });

    return {
      audios: audiosWithLikeStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ========== HELPER METHODS FOR URL PROCESSING ==========
  private async processAudiosWithFreshUrls(audios: any[]): Promise<any[]> {
    // If no audios, return empty array
    if (!audios || audios.length === 0) {
      return [];
    }

    // For small datasets (< 1000), process all at once
    if (audios.length < 1000) {
      return await this.batchProcessAudios(audios);
    }

    // For large datasets, process in smaller batches to prevent memory issues
    const BATCH_SIZE = 100;
    const processedAudios: any[] = [];

    for (let i = 0; i < audios.length; i += BATCH_SIZE) {
      const batch = audios.slice(i, i + BATCH_SIZE);
      try {
        const processedBatch = await this.batchProcessAudios(batch);
        processedAudios.push(...processedBatch);

        // Add small delay between batches to prevent overwhelming the system
        if (i + BATCH_SIZE < audios.length) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      } catch (error) {
        console.error(
          `Error processing audio batch ${i}-${i + BATCH_SIZE}:`,
          error,
        );
        // Include original audios in case of error to prevent data loss
        processedAudios.push(...batch);
      }
    }

    return processedAudios;
  }

  private async batchProcessAudios(audios: any[]): Promise<any[]> {
    const processedAudios = await Promise.allSettled(
      audios.map(async (audio) => {
        try {
          // Check if URL needs refresh (older than 6 days)
          const audioAge = Date.now() - new Date(audio.updatedAt).getTime();
          const sixDaysInMs = 6 * 24 * 60 * 60 * 1000;

          if (audioAge > sixDaysInMs && audio.status === "completed") {
            // Refresh the URL for this audio
            await this.refreshAudioUrl(audio.id);
            // Get the updated audio data
            const updatedAudio = await this.audioModel.findByPk(audio.id, {
              include: [
                { model: AudioTask, as: "task" },
                {
                  model: User,
                  as: "student",
                  attributes: [
                    "user_id",
                    "first_name",
                    "last_name",
                    "username",
                    "avatar_url",
                    "level_id",
                  ],
                  include: [
                    {
                      model: Course,
                      as: "level",
                      attributes: [
                        "id",
                        "title",
                        "description",
                        "level",
                        "isActive",
                      ],
                    },
                  ],
                },
              ],
            });
            return updatedAudio || audio;
          }

          return audio;
        } catch (error) {
          console.error(`Error processing audio ${audio.id}:`, error);
          // Return original audio if processing fails
          return audio;
        }
      }),
    );

    // Extract successful results and fallback to original audio for failed ones
    return processedAudios.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(
          `Failed to process audio ${audios[index].id}:`,
          result.reason,
        );
        return audios[index]; // Return original audio on failure
      }
    });
  }

  async getTaskAudios(taskId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const audios = await this.audioModel.findAll({
      where: { taskId, status: "completed" },
      order: [
        ["trendingScore", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    const total = await this.audioModel.count({
      where: { taskId, status: "completed" },
    });

    return {
      audios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ========== LIKES ==========
  async toggleLike(audioId: number, userId: string) {
    const audio = await this.getAudioById(audioId);

    const existingLike = await this.audioLikeModel.findOne({
      where: { audioId, userId },
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      await audio.decrement("likeCount");
      await this.updateTrendingScore(audioId);
      return { liked: false, message: "Audio unliked" };
    } else {
      // Like
      await this.audioLikeModel.create({ audioId, userId });
      await audio.increment("likeCount");
      await this.updateTrendingScore(audioId);

      // Reward the user who liked
      await this.rewardUser(userId, REWARDS.LIKE.coins, REWARDS.LIKE.points);

      // Notify audio owner
      if (audio.studentId !== userId) {
        await this.sendNotification({
          userId: audio.studentId,
          fromUserId: userId,
          audioId,
          type: NotificationType.LIKE,
          message: "Someone liked your audio!",
        });
      }

      return { liked: true, message: "Audio liked" };
    }
  }

  // ========== COMMENTS ==========
  async addComment(createCommentDto: CreateCommentDto, userId: string) {
    const audio = await this.getAudioById(createCommentDto.audioId);

    // Check if user has previously commented on this audio
    const previousCommentCount = await this.audioCommentModel.count({
      where: {
        audioId: createCommentDto.audioId,
        userId,
      },
    });

    const comment = await this.audioCommentModel.create({
      ...createCommentDto,
      userId,
    });

    await audio.increment("commentCount");
    await this.updateTrendingScore(createCommentDto.audioId);

    // Reward the user who commented only on their first comment on this audio
    if (previousCommentCount === 0) {
      await this.rewardUser(
        userId,
        REWARDS.COMMENT.coins,
        REWARDS.COMMENT.points,
      );
    }

    // Notify audio owner
    if (audio.studentId !== userId) {
      await this.sendNotification({
        userId: audio.studentId,
        fromUserId: userId,
        audioId: createCommentDto.audioId,
        type: NotificationType.COMMENT,
        message: "Someone commented on your audio!",
      });
    }

    return comment;
  }

  async getAudioComments(audioId: number) {
    // Validate audioId parameter
    if (
      !audioId ||
      isNaN(audioId) ||
      !Number.isInteger(audioId) ||
      audioId <= 0
    ) {
      throw new BadRequestException("Invalid audio ID provided");
    }

    return await this.audioCommentModel.findAll({
      where: { audioId },
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "avatar_url",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async deleteComment(commentId: number, userId: string) {
    const comment = await this.audioCommentModel.findByPk(commentId);
    if (!comment) throw new NotFoundException("Comment not found");

    if (comment.userId !== userId) {
      throw new BadRequestException("You can only delete your own comments");
    }

    const audioId = comment.audioId;
    await comment.destroy();

    await this.audioModel.decrement("commentCount", {
      where: { id: audioId },
    });
    await this.updateTrendingScore(audioId);

    return { message: "Comment deleted successfully" };
  }

  // ========== JUDGE ==========
  async addJudge(createJudgeDto: CreateJudgeDto, judgeUserId: string) {
    const audio = await this.getAudioById(createJudgeDto.audioId);

    // Check if user already judged this audio
    const existingJudge = await this.audioJudgeModel.findOne({
      where: { audioId: createJudgeDto.audioId, judgeUserId },
    });

    let judge;
    let isNewJudge = false;

    if (existingJudge) {
      // Update existing judge rating
      await existingJudge.update({
        rating: createJudgeDto.rating,
      });
      judge = existingJudge;
    } else {
      // Create new judge
      judge = await this.audioJudgeModel.create({
        ...createJudgeDto,
        judgeUserId,
      });
      isNewJudge = true;

      // Only increment judge count for new judges
      await audio.increment("judgeCount");

      // Only reward for new judges, not updates
      await this.rewardUser(
        judgeUserId,
        REWARDS.JUDGE.coins,
        REWARDS.JUDGE.points,
      );
    }

    // Always update average rating and trending score
    await this.updateAudioAverageRating(createJudgeDto.audioId);
    await this.updateTrendingScore(createJudgeDto.audioId);

    // Notify audio owner (for both new and updated ratings)
    if (audio.studentId !== judgeUserId) {
      const notificationMessage = isNewJudge
        ? `Someone judged your audio! Rating: ${createJudgeDto.rating}/5`
        : `Someone updated their rating on your audio! New rating: ${createJudgeDto.rating}/5`;

      await this.sendNotification({
        userId: audio.studentId,
        fromUserId: judgeUserId,
        audioId: createJudgeDto.audioId,
        type: NotificationType.JUDGE,
        message: notificationMessage,
      });
    }

    return judge;
  }

  async getAudioJudges(audioId: number) {
    // Validate audioId parameter
    if (
      !audioId ||
      isNaN(audioId) ||
      !Number.isInteger(audioId) ||
      audioId <= 0
    ) {
      throw new BadRequestException("Invalid audio ID provided");
    }

    return await this.audioJudgeModel.findAll({
      where: { audioId },
      include: [
        {
          model: User,
          as: "judge",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "avatar_url",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // ========== HELPER METHODS ==========
  private async updateTrendingScore(audioId: number) {
    const audio = await this.audioModel.findByPk(audioId);
    if (!audio) return;

    // Trending Score Formula: likes + comments + (judges * 3)
    const trendingScore =
      audio.likeCount + audio.commentCount + audio.judgeCount * 3;
    await audio.update({ trendingScore });
  }

  private async updateAudioAverageRating(audioId: number) {
    const judges = await this.audioJudgeModel.findAll({
      where: { audioId },
    });

    if (judges.length === 0) return;

    const totalRating = judges.reduce((sum, j) => sum + j.rating, 0);
    const averageRating = totalRating / judges.length;

    await this.audioModel.update({ averageRating }, { where: { id: audioId } });
  }

  async incrementViewCount(audioId: number) {
    await this.audioModel.increment("viewCount", {
      where: { id: audioId },
    });
  }

  // ========== REWARDS & GAMIFICATION ==========
  private async rewardUser(userId: string, coins: number, points: number) {
    try {
      const profile = await this.studentProfileService.findByUserId(userId);

      // Add coins and points
      await profile.increment("coins", { by: coins });
      await profile.increment("points", { by: points });

      // Level up logic
      await profile.reload();
      const xpNeeded = 100 + profile.level * 40;

      if (profile.points >= xpNeeded) {
        const newLevel = Math.floor(profile.points / xpNeeded);
        if (newLevel > profile.level) {
          await profile.update({ level: newLevel });
        }
      }
    } catch (error) {
      console.error("Error rewarding user:", error);
      // Don't throw - rewards shouldn't break the main flow
    }
  }

  private async updateStreak(userId: string) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const profile = await this.studentProfileService.findByUserId(userId);

      if (!profile) return;

      // If already active today, don't update
      if (profile.last_active_date === today) return;

      // Check if streak should continue (yesterday) or reset
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (profile.last_active_date === yesterdayStr) {
        // Continue streak
        await profile.increment("streaks");
      } else if (profile.last_active_date !== today) {
        // Reset streak if missed a day
        await profile.update({ streaks: 1 });
      }

      await profile.update({ last_active_date: today });
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  }

  // ========== NOTIFICATIONS ==========
  private async notifyNewAudioUpload(uploaderId: string, audioId: number) {
    try {
      // Get all users except the uploader
      const allUsers = await this.userModel.findAll({
        where: {
          user_id: { [Op.ne]: uploaderId },
        },
        attributes: ["user_id"],
      });

      // Get uploader's name and audio details
      const uploader = await this.userModel.findByPk(uploaderId, {
        attributes: ["first_name", "last_name", "username", "avatar_url"],
      });

      const audio = await this.audioModel.findByPk(audioId, {
        include: [{ model: AudioTask, as: "task" }],
      });

      const uploaderName = uploader
        ? `${uploader.first_name} ${uploader.last_name}`
        : "Someone";

      const message = `${uploaderName} uploaded a new Speaking Challenge audio! Listen to it now 🔥!`;

      // Emit SSE event for new audio upload
      const sseEventData = {
        type: "NEW_AUDIO_UPLOAD",
        audioId: audioId,
        audio: {
          id: audio.id,
          caption: audio.caption,
          audioUrl: audio.audioUrl,
          createdAt: audio.createdAt,
          task: (audio as any).task || null,
        },
        uploader: {
          id: uploaderId,
          name: uploaderName,
          username: uploader?.username,
          avatarUrl: uploader?.avatar_url,
        },
        message: message,
        timestamp: new Date().toISOString(),
      };

      this.eventEmitter.emit("audio.uploaded", sseEventData);

      // Get all FCM tokens except uploader's
      const tokens = await this.notificationTokenModel.findAll({
        where: {
          user_id: { [Op.ne]: uploaderId },
        },
      });

      if (tokens.length > 0) {
        const fcmTokens = tokens.map((t) => t.token);

        // Send push notification
        await this.firebaseService.sendMulticastNotification(
          fcmTokens,
          "🎤 New Speaking Challenge!",
          message,
          {
            type: "NEW_AUDIO",
            audioId: audioId.toString(),
            fromUserId: uploaderId,
          },
        );
      }
    } catch (error) {
      console.error("Error sending new audio notification:", error);
      // Don't throw - notifications shouldn't break the main flow
    }
  }

  private async sendNotification(params: {
    userId: string;
    fromUserId?: string;
    audioId?: number;
    type: NotificationType;
    message: string;
  }) {
    try {
      // Fetch username if fromUserId is provided
      let username = "Someone";
      if (params.fromUserId) {
        const user = await this.userModel.findByPk(params.fromUserId, {
          attributes: ["first_name", "last_name", "username"],
        });
        if (user) {
          username = `${user.first_name} ${user.last_name}`;
        }
      }

      // Replace "Someone" in message with actual username
      const personalizedMessage = params.message.replace("Someone", username);

      // Send push notification
      const tokens = await this.notificationTokenModel.findAll({
        where: { user_id: params.userId },
      });

      if (tokens.length > 0) {
        const fcmTokens = tokens.map((t) => t.token);

        let title = "New Activity";
        switch (params.type) {
          case NotificationType.LIKE:
            title = "❤️ New Like";
            break;
          case NotificationType.COMMENT:
            title = "💬 New Comment";
            break;
          case NotificationType.JUDGE:
            title = "⭐ New Rating";
            break;
        }

        await this.firebaseService.sendMulticastNotification(
          fcmTokens,
          title,
          personalizedMessage,
          {
            type: params.type,
            audioId: params.audioId?.toString() || "",
            fromUserId: params.fromUserId || "",
          },
        );
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      // Don't throw - notifications shouldn't break the main flow
    }
  }

  // ========== PRESIGNED URL MANAGEMENT ==========
  async refreshAudioUrl(audioId: number): Promise<string> {
    // Validate audioId parameter
    if (
      !audioId ||
      isNaN(audioId) ||
      !Number.isInteger(audioId) ||
      audioId <= 0
    ) {
      throw new BadRequestException("Invalid audio ID provided");
    }

    const audio = await this.audioModel.findByPk(audioId);
    if (!audio) {
      throw new NotFoundException("Audio not found");
    }

    const objectName = `audios/${audioId}.mp3`;
    const newPresignedUrl = await this.awsStorageService.getPresignedUrl(
      "speakup",
      objectName,
      7 * 24 * 60 * 60, // 7 days
    );

    await audio.update({
      audioUrl: newPresignedUrl,
    });

    return newPresignedUrl;
  }

  async getAudioWithFreshUrl(audioId: number) {
    // Validate audioId parameter
    if (
      !audioId ||
      isNaN(audioId) ||
      !Number.isInteger(audioId) ||
      audioId <= 0
    ) {
      throw new BadRequestException("Invalid audio ID provided");
    }

    try {
      const audio = await this.getAudioById(audioId);

      // Check if URL needs refresh (you might want to store expiry date)
      // For now, we'll refresh if the URL is older than 6 days
      const audioAge = Date.now() - new Date(audio.updatedAt).getTime();
      const sixDaysInMs = 6 * 24 * 60 * 60 * 1000;

      if (audioAge > sixDaysInMs && audio.status === "completed") {
        try {
          await this.refreshAudioUrl(audioId);
          return await this.getAudioById(audioId); // Fetch updated audio
        } catch (refreshError) {
          console.error(
            `Failed to refresh URL for audio ${audioId}:`,
            refreshError,
          );
          // Return original audio if refresh fails
          return audio;
        }
      }

      return audio;
    } catch (error) {
      console.error(
        `Error in getAudioWithFreshUrl for audio ${audioId}:`,
        error,
      );
      throw error; // Re-throw the error for the caller to handle
    }
  }

  // ========== SSE EVENT LISTENERS ==========
  onAudioUploaded(callback: (data: any) => void) {
    this.eventEmitter.on("audio.uploaded", callback);
  }

  removeAudioUploadListener(callback: (data: any) => void) {
    this.eventEmitter.off("audio.uploaded", callback);
  }
}
