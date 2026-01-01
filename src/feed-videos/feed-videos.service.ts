import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue, Job } from "bullmq";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  CreateFeedVideoDto,
  CreateTaskDto,
  CreateCommentDto,
  CreateJudgeDto,
} from "./dto/create-feed-video.dto.js";
import { UpdateFeedVideoDto } from "./dto/update-feed-video.dto.js";
import { FeedVideo } from "./entities/feed-video.js";
import { FeedVideoTask } from "./entities/feed-video-task.entity.js";
import { VideoLike } from "./entities/likes.js";
import { VideoComment } from "./entities/comments.js";
import { VideoJudge } from "./entities/judge.js";
import { FeedVideoNotification } from "./entities/feed-video-notification.entity.js";
import { Op } from "sequelize";
import { REWARDS, NotificationType } from "./constants/rewards.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";
import { FirebaseServiceService } from "../notifications/firebase-service.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { User } from "../users/entities/user.entity.js";
import { VideoCompressionJobData } from "./video-compression.processor.js";
import { MinioService } from "../minio/minio.service.js";
import * as path from "path";
import * as fs from "fs/promises";
import { existsSync } from "fs";

@Injectable()
export class FeedVideosService {
  constructor(
    @InjectModel(FeedVideo)
    private feedVideoModel: typeof FeedVideo,
    @InjectModel(FeedVideoTask)
    private feedVideoTaskModel: typeof FeedVideoTask,
    @InjectModel(VideoLike)
    private videoLikeModel: typeof VideoLike,
    @InjectModel(VideoComment)
    private videoCommentModel: typeof VideoComment,
    @InjectModel(VideoJudge)
    private videoJudgeModel: typeof VideoJudge,
    @InjectModel(FeedVideoNotification)
    private notificationModel: typeof FeedVideoNotification,
    @InjectModel(NotificationToken)
    private notificationTokenModel: typeof NotificationToken,
    @InjectModel(User)
    private userModel: typeof User,
    private studentProfileService: StudentProfileService,
    private firebaseService: FirebaseServiceService,
    @InjectQueue("video-compression")
    private videoCompressionQueue: Queue<VideoCompressionJobData>,
    private eventEmitter: EventEmitter2,
    private minioService: MinioService
  ) {}

  // ========== TASK MANAGEMENT (Admin) ==========
  async createTask(createTaskDto: CreateTaskDto, adminId: string) {
    const task = await this.feedVideoTaskModel.create({
      ...createTaskDto,
      createdBy: adminId,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
    });
    return task;
  }

  async getAllTasks(status?: string) {
    const where = status ? { status } : {};
    return await this.feedVideoTaskModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  async getTaskById(taskId: number) {
    const task = await this.feedVideoTaskModel.findByPk(taskId);
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async updateTask(taskId: number, updateData: Partial<CreateTaskDto>) {
    const task = await this.getTaskById(taskId);
    const processedData = {
      ...updateData,
      dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
    };
    await task.update(processedData);
    return task;
  }

  // ========== VIDEO MANAGEMENT (Student) ==========
  async uploadVideo(
    file: Express.Multer.File,
    createVideoDto: CreateFeedVideoDto,
    studentId: string
  ) {
    // Create initial video record with pending status
    const { videoUrl: _, thumbnailUrl: __, ...videoData } = createVideoDto;
    const video = await this.feedVideoModel.create({
      ...videoData,
      videoUrl: "", // Will be updated after compression and MinIO upload
      thumbnailUrl: "",
      studentId,
      status: "processing", // Processing status until compression and upload complete
    });

    // Add to compression queue (file is in temp folder)
    const job = await this.addVideoToCompressionQueue(
      file.path,
      file.originalname,
      parseInt(studentId),
      video.id
    );

    // Increment task submission count if taskId provided
    if (createVideoDto.taskId) {
      await this.feedVideoTaskModel.increment("submissionCount", {
        where: { id: createVideoDto.taskId },
      });
    }

    return {
      videoId: video.id,
      jobId: job.id,
      status: "processing",
      message: "Video uploaded to temp folder and queued for compression",
    };
  }

  async getVideoById(videoId: number) {
    // Validate videoId parameter
    if (
      !videoId ||
      isNaN(videoId) ||
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {
      throw new BadRequestException("Invalid video ID provided");
    }

    const video = await this.feedVideoModel.findByPk(videoId, {
      include: [
        { model: FeedVideoTask, as: "task" },
        { model: VideoLike, as: "likes" },
        { model: VideoComment, as: "comments" },
        { model: VideoJudge, as: "judges" },
      ],
    });
    if (!video) throw new NotFoundException("Video not found");
    return video;
  }

  async getMyVideos(studentId: string) {
    return await this.feedVideoModel.findAll({
      where: { studentId },
      include: [{ model: FeedVideoTask, as: "task" }],
      order: [["createdAt", "DESC"]],
    });
  }

  async deleteVideo(videoId: number, studentId: string) {
    // Validate videoId parameter
    if (
      !videoId ||
      isNaN(videoId) ||
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {
      throw new BadRequestException("Invalid video ID provided");
    }

    const video = await this.getVideoById(videoId);
    if (video.studentId !== studentId) {
      throw new BadRequestException("You can only delete your own videos");
    }

    // Delete the video file from MinIO
    if (video.videoUrl) {
      try {
        // Extract object name from MinIO URL or use video ID as object name
        const objectName = `videos/${video.id}.mp4`;
        await this.minioService.deleteFile("feed-videos", objectName);
      } catch (error) {
        console.error("Error deleting video file from MinIO:", error);
        // Continue with database deletion even if MinIO deletion fails
      }
    }

    await video.destroy();
    return { message: "Video deleted successfully" };
  }

  // ========== TRENDING FEED ==========
  async getTrendingFeed(page: number = 1, limit: number = 20, userId?: string) {
    const offset = (page - 1) * limit;

    const videos = await this.feedVideoModel.findAll({
      where: { status: "completed" },
      include: [
        { model: FeedVideoTask, as: "task" },
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "avatar_url",
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

    // Process videos with fresh URLs in batches to handle large datasets
    const videosWithFreshUrls = await this.processVideosWithFreshUrls(videos);

    // Check if user has liked each video
    let videosWithLikeStatus: any[] = videosWithFreshUrls;
    if (userId) {
      const videoIds = videosWithFreshUrls.map((v) => v.id);
      const userLikes = await this.videoLikeModel.findAll({
        where: {
          videoId: videoIds,
          userId: userId,
        },
        attributes: ["videoId"],
      });

      const likedVideoIds = new Set(userLikes.map((like) => like.videoId));

      videosWithLikeStatus = videosWithFreshUrls.map((video) => {
        const videoJson =
          typeof video.toJSON === "function" ? video.toJSON() : video;
        return {
          ...videoJson,
          isLiked: likedVideoIds.has(video.id),
        };
      });
    } else {
      videosWithLikeStatus = videosWithFreshUrls.map((video) => {
        const videoJson =
          typeof video.toJSON === "function" ? video.toJSON() : video;
        return {
          ...videoJson,
          isLiked: false,
        };
      });
    }

    const total = await this.feedVideoModel.count({
      where: { status: "completed" },
    });

    return {
      videos: videosWithLikeStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ========== HELPER METHODS FOR URL PROCESSING ==========
  private async processVideosWithFreshUrls(videos: any[]): Promise<any[]> {
    // If no videos, return empty array
    if (!videos || videos.length === 0) {
      return [];
    }

    // For small datasets (< 1000), process all at once
    if (videos.length < 1000) {
      return await this.batchProcessVideos(videos);
    }

    // For large datasets, process in smaller batches to prevent memory issues
    const BATCH_SIZE = 100;
    const processedVideos: any[] = [];

    for (let i = 0; i < videos.length; i += BATCH_SIZE) {
      const batch = videos.slice(i, i + BATCH_SIZE);
      try {
        const processedBatch = await this.batchProcessVideos(batch);
        processedVideos.push(...processedBatch);

        // Add small delay between batches to prevent overwhelming the system
        if (i + BATCH_SIZE < videos.length) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      } catch (error) {
        console.error(
          `Error processing video batch ${i}-${i + BATCH_SIZE}:`,
          error
        );
        // Include original videos in case of error to prevent data loss
        processedVideos.push(...batch);
      }
    }

    return processedVideos;
  }

  private async batchProcessVideos(videos: any[]): Promise<any[]> {
    const processedVideos = await Promise.allSettled(
      videos.map(async (video) => {
        try {
          // Check if URL needs refresh (older than 6 days)
          const videoAge = Date.now() - new Date(video.updatedAt).getTime();
          const sixDaysInMs = 6 * 24 * 60 * 60 * 1000;

          if (videoAge > sixDaysInMs && video.status === "completed") {
            // Refresh the URL for this video
            await this.refreshVideoUrl(video.id);
            // Get the updated video data
            const updatedVideo = await this.feedVideoModel.findByPk(video.id, {
              include: [
                { model: FeedVideoTask, as: "task" },
                {
                  model: User,
                  as: "student",
                  attributes: [
                    "user_id",
                    "first_name",
                    "last_name",
                    "username",
                    "avatar_url",
                  ],
                },
              ],
            });
            return updatedVideo || video;
          }

          return video;
        } catch (error) {
          console.error(`Error processing video ${video.id}:`, error);
          // Return original video if processing fails
          return video;
        }
      })
    );

    // Extract successful results and fallback to original video for failed ones
    return processedVideos.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(
          `Failed to process video ${videos[index].id}:`,
          result.reason
        );
        return videos[index]; // Return original video on failure
      }
    });
  }

  async getTaskVideos(taskId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const videos = await this.feedVideoModel.findAll({
      where: { taskId, status: "completed" },
      order: [
        ["trendingScore", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    const total = await this.feedVideoModel.count({
      where: { taskId, status: "completed" },
    });

    return {
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ========== LIKES ==========
  async toggleLike(videoId: number, userId: string) {
    const video = await this.getVideoById(videoId);

    const existingLike = await this.videoLikeModel.findOne({
      where: { videoId, userId },
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      await video.decrement("likeCount");
      await this.updateTrendingScore(videoId);
      return { liked: false, message: "Video unliked" };
    } else {
      // Like
      await this.videoLikeModel.create({ videoId, userId });
      await video.increment("likeCount");
      await this.updateTrendingScore(videoId);

      // Reward the user who liked
      await this.rewardUser(userId, REWARDS.LIKE.coins, REWARDS.LIKE.points);

      // Notify video owner
      if (video.studentId !== userId) {
        await this.sendNotification({
          userId: video.studentId,
          fromUserId: userId,
          videoId,
          type: NotificationType.LIKE,
          message: "Someone liked your video!",
        });
      }

      return { liked: true, message: "Video liked" };
    }
  }

  // ========== COMMENTS ==========
  async addComment(createCommentDto: CreateCommentDto, userId: string) {
    const video = await this.getVideoById(createCommentDto.videoId);

    const comment = await this.videoCommentModel.create({
      ...createCommentDto,
      userId,
    });

    await video.increment("commentCount");
    await this.updateTrendingScore(createCommentDto.videoId);

    // Reward the user who commented
    await this.rewardUser(
      userId,
      REWARDS.COMMENT.coins,
      REWARDS.COMMENT.points
    );

    // Notify video owner
    if (video.studentId !== userId) {
      await this.sendNotification({
        userId: video.studentId,
        fromUserId: userId,
        videoId: createCommentDto.videoId,
        type: NotificationType.COMMENT,
        message: "Someone commented on your video!",
      });
    }

    return comment;
  }

  async getVideoComments(videoId: number) {
    // Validate videoId parameter
    if (
      !videoId ||
      isNaN(videoId) ||
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {
      throw new BadRequestException("Invalid video ID provided");
    }

    return await this.videoCommentModel.findAll({
      where: { videoId },
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
    const comment = await this.videoCommentModel.findByPk(commentId);
    if (!comment) throw new NotFoundException("Comment not found");

    if (comment.userId !== userId) {
      throw new BadRequestException("You can only delete your own comments");
    }

    const videoId = comment.videoId;
    await comment.destroy();

    await this.feedVideoModel.decrement("commentCount", {
      where: { id: videoId },
    });
    await this.updateTrendingScore(videoId);

    return { message: "Comment deleted successfully" };
  }

  // ========== JUDGE ==========
  async addJudge(createJudgeDto: CreateJudgeDto, judgeUserId: string) {
    const video = await this.getVideoById(createJudgeDto.videoId);

    // Check if user already judged this video
    const existingJudge = await this.videoJudgeModel.findOne({
      where: { videoId: createJudgeDto.videoId, judgeUserId },
    });

    if (existingJudge) {
      throw new BadRequestException("You have already judged this video");
    }

    const judge = await this.videoJudgeModel.create({
      ...createJudgeDto,
      judgeUserId,
    });

    await video.increment("judgeCount");
    await this.updateVideoAverageScores(createJudgeDto.videoId);
    await this.updateTrendingScore(createJudgeDto.videoId);

    // Reward the judge
    await this.rewardUser(
      judgeUserId,
      REWARDS.JUDGE.coins,
      REWARDS.JUDGE.points
    );

    // Notify video owner
    if (video.studentId !== judgeUserId) {
      await this.sendNotification({
        userId: video.studentId,
        fromUserId: judgeUserId,
        videoId: createJudgeDto.videoId,
        type: NotificationType.JUDGE,
        message: `Someone judged your video! Fluency: ${createJudgeDto.fluencyScore}/10, Clarity: ${createJudgeDto.clarityScore}/10`,
      });
    }

    return judge;
  }

  async getVideoJudges(videoId: number) {
    // Validate videoId parameter
    if (
      !videoId ||
      isNaN(videoId) ||
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {
      throw new BadRequestException("Invalid video ID provided");
    }

    return await this.videoJudgeModel.findAll({
      where: { videoId },
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
      order: [
        ["helpfulCount", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async markJudgeHelpful(judgeId: number) {
    const judge = await this.videoJudgeModel.findByPk(judgeId);
    if (!judge) throw new NotFoundException("Judge not found");

    await judge.increment("helpfulCount");
    return judge;
  }

  // ========== HELPER METHODS ==========
  private async updateTrendingScore(videoId: number) {
    const video = await this.feedVideoModel.findByPk(videoId);
    if (!video) return;

    // Trending Score Formula: likes + comments + (judges * 3)
    const trendingScore =
      video.likeCount + video.commentCount + video.judgeCount * 3;
    await video.update({ trendingScore });
  }

  private async updateVideoAverageScores(videoId: number) {
    const judges = await this.videoJudgeModel.findAll({
      where: { videoId },
    });

    if (judges.length === 0) return;

    const totalFluency = judges.reduce((sum, j) => sum + j.fluencyScore, 0);
    const totalClarity = judges.reduce((sum, j) => sum + j.clarityScore, 0);

    const averageFluencyScore = totalFluency / judges.length;
    const averageClarityScore = totalClarity / judges.length;

    await this.feedVideoModel.update(
      { averageFluencyScore, averageClarityScore },
      { where: { id: videoId } }
    );
  }

  async incrementViewCount(videoId: number) {
    await this.feedVideoModel.increment("viewCount", {
      where: { id: videoId },
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
  private async notifyNewVideoUpload(uploaderId: string, videoId: number) {
    try {
      // Get all users except the uploader
      const allUsers = await this.userModel.findAll({
        where: {
          user_id: { [Op.ne]: uploaderId },
        },
        attributes: ["user_id"],
      });

      // Get uploader's name and video details
      const uploader = await this.userModel.findByPk(uploaderId, {
        attributes: ["first_name", "last_name", "username", "avatar_url"],
      });

      const video = await this.feedVideoModel.findByPk(videoId, {
        include: [{ model: FeedVideoTask, as: "task" }],
      });

      const uploaderName = uploader
        ? `${uploader.first_name} ${uploader.last_name}`
        : "Someone";

      const message = `${uploaderName} uploaded a new Speaking Challenge video! Watch it now 🔥!`;

      // Emit SSE event for new video upload
      const sseEventData = {
        type: "NEW_VIDEO_UPLOAD",
        videoId: videoId,
        video: {
          id: video.id,
          caption: video.caption,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          createdAt: video.createdAt,
          task: (video as any).task || null,
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

      this.eventEmitter.emit("video.uploaded", sseEventData);

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
          "🎥 New Speaking Challenge!",
          message,
          {
            type: "NEW_VIDEO",
            videoId: videoId.toString(),
            fromUserId: uploaderId,
          }
        );
      }
    } catch (error) {
      console.error("Error sending new video notification:", error);
      // Don't throw - notifications shouldn't break the main flow
    }
  }

  private async sendNotification(params: {
    userId: string;
    fromUserId?: string;
    videoId?: number;
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
            title = "⭐ New Feedback";
            break;
        }

        await this.firebaseService.sendMulticastNotification(
          fcmTokens,
          title,
          personalizedMessage,
          {
            type: params.type,
            videoId: params.videoId?.toString() || "",
            fromUserId: params.fromUserId || "",
          }
        );
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      // Don't throw - notifications shouldn't break the main flow
    }
  }

  async getMyNotifications(userId: string, limit: number = 20) {
    return await this.notificationModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  async markNotificationAsRead(notificationId: number, userId: string) {
    const notification = await this.notificationModel.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    await notification.update({ isRead: true });
    return notification;
  }

  // ========== VIDEO COMPRESSION QUEUE METHODS ==========
  async addVideoToCompressionQueue(
    inputPath: string,
    originalFilename: string,
    userId: number,
    videoId?: number
  ): Promise<Job<VideoCompressionJobData>> {
    const timestamp = Date.now();
    const ext = path.extname(originalFilename);
    const outputFilename = `compressed_${timestamp}${ext}`;

    // Ensure cross-platform path handling
    const normalizedInputPath = path.resolve(inputPath);
    const outputPath = path.resolve(
      process.cwd(),
      "uploads",
      "videos",
      outputFilename
    );

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    const jobData: VideoCompressionJobData = {
      inputPath: normalizedInputPath,
      outputPath,
      userId,
      videoId,
      originalFilename,
    };

    const job = await this.videoCompressionQueue.add(
      "compress-video",
      jobData,
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
      }
    );

    return job;
  }

  async getCompressionJobStatus(jobId: string): Promise<any> {
    const job = await this.videoCompressionQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException("Job not found");
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;

    return {
      id: job.id,
      state,
      progress,
      result,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
    };
  }

  async updateVideoAfterCompression(
    videoId: number,
    outputPath: string,
    compressedSize: number
  ) {
    const video = await this.feedVideoModel.findByPk(videoId);
    if (!video) {
      throw new NotFoundException("Video not found");
    }

    try {
      // Ensure feed-videos bucket exists
      const bucketExists = await this.minioService.bucketExists("feed-videos");
      if (!bucketExists) {
        await this.minioService.makeBucket("feed-videos");
      }

      // Upload compressed video to MinIO
      const objectName = `videos/${videoId}.mp4`;
      await this.minioService.uploadFile(
        "feed-videos",
        objectName,
        outputPath,
        {
          "Content-Type": "video/mp4",
          "Original-Size": compressedSize.toString(),
        }
      );

      // Generate presigned URL (valid for 7 days)
      const presignedUrl = await this.minioService.getPresignedUrl(
        "feed-videos",
        objectName,
        7 * 24 * 60 * 60 // 7 days
      );

      // Update video record with MinIO URL
      await video.update({
        videoUrl: presignedUrl,
        thumbnailUrl: presignedUrl, // Can be updated with actual thumbnail later
        status: "completed",
      });

      // Clean up temporary compressed file
      try {
        await fs.unlink(outputPath);
      } catch (error) {
        console.error("Error cleaning up temp file:", error);
      }

      // Reward user for successful video processing
      await this.rewardUser(
        video.studentId,
        REWARDS.VIDEO_UPLOAD.coins,
        REWARDS.VIDEO_UPLOAD.points
      );

      // Update streak
      await this.updateStreak(video.studentId);

      // Send notifications after video processing is complete
      await this.notifyNewVideoUpload(video.studentId, videoId);

      return video;
    } catch (error) {
      console.error("Error uploading to MinIO:", error);
      // Update video status to failed
      await video.update({ status: "draft" });
      throw error;
    }
  }

  // ========== PRESIGNED URL MANAGEMENT ==========
  async refreshVideoUrl(videoId: number): Promise<string> {
    // Validate videoId parameter
    if (
      !videoId ||
      isNaN(videoId) ||
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {
      throw new BadRequestException("Invalid video ID provided");
    }

    const video = await this.feedVideoModel.findByPk(videoId);
    if (!video) {
      throw new NotFoundException("Video not found");
    }

    const objectName = `videos/${videoId}.mp4`;
    const newPresignedUrl = await this.minioService.getPresignedUrl(
      "feed-videos",
      objectName,
      7 * 24 * 60 * 60 // 7 days
    );

    await video.update({
      videoUrl: newPresignedUrl,
      thumbnailUrl: newPresignedUrl,
    });

    return newPresignedUrl;
  }

  async getVideoWithFreshUrl(videoId: number) {
    // Validate videoId parameter
    if (
      !videoId ||
      isNaN(videoId) ||
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {
      throw new BadRequestException("Invalid video ID provided");
    }

    try {
      const video = await this.getVideoById(videoId);

      // Check if URL needs refresh (you might want to store expiry date)
      // For now, we'll refresh if the URL is older than 6 days
      const videoAge = Date.now() - new Date(video.updatedAt).getTime();
      const sixDaysInMs = 6 * 24 * 60 * 60 * 1000;

      if (videoAge > sixDaysInMs && video.status === "completed") {
        try {
          await this.refreshVideoUrl(videoId);
          return await this.getVideoById(videoId); // Fetch updated video
        } catch (refreshError) {
          console.error(
            `Failed to refresh URL for video ${videoId}:`,
            refreshError
          );
          // Return original video if refresh fails
          return video;
        }
      }

      return video;
    } catch (error) {
      console.error(
        `Error in getVideoWithFreshUrl for video ${videoId}:`,
        error
      );
      throw error; // Re-throw the error for the caller to handle
    }
  }

  // ========== SSE EVENT LISTENERS ==========
  onVideoUploaded(callback: (data: any) => void) {
    this.eventEmitter.on("video.uploaded", callback);
  }

  removeVideoUploadListener(callback: (data: any) => void) {
    this.eventEmitter.off("video.uploaded", callback);
  }
}
