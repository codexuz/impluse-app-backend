import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
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
    private firebaseService: FirebaseServiceService
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
    // Generate file path for the uploaded video
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    const videoUrl = `/uploads/videos/${fileName}`;

    // Create video record in database with local file path
    const video = await this.feedVideoModel.create({
      ...createVideoDto,
      videoUrl,
      thumbnailUrl: videoUrl, // You can generate thumbnail separately if needed
      studentId,
      status: "published",
    });

    // Increment task submission count if taskId provided
    if (createVideoDto.taskId) {
      await this.feedVideoTaskModel.increment("submissionCount", {
        where: { id: createVideoDto.taskId },
      });
    }

    // Reward user for video upload
    await this.rewardUser(
      studentId,
      REWARDS.VIDEO_UPLOAD.coins,
      REWARDS.VIDEO_UPLOAD.points
    );

    // Update streak
    await this.updateStreak(studentId);

    return video;
  }

  async getVideoById(videoId: number) {
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
    const video = await this.getVideoById(videoId);
    if (video.studentId !== studentId) {
      throw new BadRequestException("You can only delete your own videos");
    }

    await video.destroy();
    return { message: "Video deleted successfully" };
  }

  // ========== TRENDING FEED ==========
  async getTrendingFeed(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const videos = await this.feedVideoModel.findAll({
      where: { status: "published" },
      include: [{ model: FeedVideoTask, as: "task" }],
      order: [
        ["trendingScore", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    const total = await this.feedVideoModel.count({
      where: { status: "published" },
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

  async getTaskVideos(taskId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const videos = await this.feedVideoModel.findAll({
      where: { taskId, status: "published" },
      order: [
        ["trendingScore", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    const total = await this.feedVideoModel.count({
      where: { taskId, status: "published" },
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
    return await this.videoCommentModel.findAll({
      where: { videoId },
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
    return await this.videoJudgeModel.findAll({
      where: { videoId },
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

      // Create notification record
      await this.notificationModel.create({
        userId: params.userId,
        fromUserId: params.fromUserId,
        videoId: params.videoId,
        type: params.type,
        message: personalizedMessage,
      });

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

  // Legacy methods for compatibility
  create(createFeedVideoDto: CreateFeedVideoDto) {
    return "Use uploadVideo instead";
  }

  findAll() {
    return `Use getTrendingFeed instead`;
  }

  findOne(id: number) {
    return `Use getVideoById instead`;
  }

  update(id: number, updateFeedVideoDto: UpdateFeedVideoDto) {
    return `This action updates a #${id} feedVideo`;
  }

  remove(id: number) {
    return `Use deleteVideo instead`;
  }
}
