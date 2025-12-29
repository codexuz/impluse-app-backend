import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Headers,
  HttpStatus,
  Header,
  NotFoundException,
  Sse,
  MessageEvent,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { statSync, createReadStream, existsSync } from "fs";
import { Response } from "express";
import { Observable, interval } from "rxjs";
import { map, switchMap, takeWhile } from "rxjs/operators";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { FeedVideosService } from "./feed-videos.service.js";
import {
  CreateFeedVideoDto,
  CreateTaskDto,
  CreateCommentDto,
  CreateJudgeDto,
} from "./dto/create-feed-video.dto.js";
import { UpdateFeedVideoDto } from "./dto/update-feed-video.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@ApiTags("Feed Videos")
@Controller("feed-videos")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FeedVideosController {
  constructor(private readonly feedVideosService: FeedVideosService) {}

  // ========== SSE EVENTS ==========
  @Sse("new-videos/stream")
  @ApiOperation({
    summary: "Server-Sent Events stream for new video uploads",
    description:
      "Subscribe to real-time notifications when new videos are uploaded",
  })
  @ApiResponse({
    status: 200,
    description: "SSE stream established",
    headers: {
      "Content-Type": { description: "text/event-stream" },
      "Cache-Control": { description: "no-cache" },
      Connection: { description: "keep-alive" },
    },
  })
  streamNewVideos(
    @Headers() headers: any,
    @CurrentUser() user: any
  ): Observable<MessageEvent> {
    // Create an observable that listens for video upload events
    return new Observable<MessageEvent>((observer) => {
      const eventHandler = (data: any) => {
        // Don't send notification to the uploader themselves
        if (data.uploader.id !== user.userId) {
          const event: MessageEvent = {
            data: JSON.stringify(data),
            type: "new-video",
            id: Date.now().toString(),
          };
          observer.next(event);
        }
      };

      // Listen for video upload events
      this.feedVideosService.onVideoUploaded(eventHandler);

      // Cleanup when client disconnects
      return () => {
        this.feedVideosService.removeVideoUploadListener(eventHandler);
      };
    });
  }

  // ========== TASK MANAGEMENT (Admin) ==========
  @Post("tasks")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new video task for students" })
  @ApiResponse({ status: 201, description: "Task created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  createTask(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    const adminId = user.userId;
    return this.feedVideosService.createTask(createTaskDto, adminId);
  }

  @Get("tasks")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all video tasks" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status",
  })
  @ApiResponse({ status: 200, description: "Return all tasks" })
  getAllTasks(@Query("status") status?: string) {
    return this.feedVideosService.getAllTasks(status);
  }

  @Get("tasks/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get task by ID" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Return task details" })
  @ApiResponse({ status: 404, description: "Task not found" })
  getTaskById(@Param("id") id: string) {
    return this.feedVideosService.getTaskById(+id);
  }

  @Patch("tasks/:id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a task" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Task updated successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  updateTask(
    @Param("id") id: string,
    @Body() updateTaskDto: Partial<CreateTaskDto>
  ) {
    return this.feedVideosService.updateTask(+id, updateTaskDto);
  }

  @Get("tasks/:taskId/videos")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all videos for a specific task" })
  @ApiParam({ name: "taskId", description: "Task ID" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiResponse({ status: 200, description: "Return videos for task" })
  getTaskVideos(
    @Param("taskId") taskId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.feedVideosService.getTaskVideos(
      +taskId,
      page ? +page : 1,
      limit ? +limit : 20
    );
  }

  // ========== VIDEO MANAGEMENT (Student) ==========
  @Post("upload")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({
    summary: "Upload a video file",
    description:
      "Uploads a video and queues it for compression. Returns job ID for tracking progress via SSE.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Video upload with file and metadata",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Video file",
        },
        caption: {
          type: "string",
          description: "Video caption",
          example: "My speaking practice video",
        },
        taskId: {
          type: "number",
          description: "Task ID (optional)",
          example: 1,
        },
      },
      required: ["file", "caption"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Video uploaded and queued for compression",
    schema: {
      type: "object",
      properties: {
        videoId: { type: "number", example: 123 },
        jobId: { type: "string", example: "1" },
        status: { type: "string", example: "processing" },
        message: {
          type: "string",
          example: "Video uploaded and queued for compression",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - invalid file or data",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/temp",
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 1000 * 1024 * 1024, // 1000MB limit
      },
    })
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body("caption") caption: string,
    @Body("taskId") taskId: string,
    @CurrentUser() user: any
  ) {
    if (!file) {
      throw new BadRequestException("Video file is required");
    }

    if (!caption) {
      throw new BadRequestException("Video caption is required");
    }

    // Validate file type (video only)
    const allowedMimeTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only video files are allowed."
      );
    }

    const studentId = user.userId;
    const createVideoDto: CreateFeedVideoDto = {
      caption,
      taskId: taskId ? +taskId : undefined,
    };
    return this.feedVideosService.uploadVideoWithCompression(
      file,
      createVideoDto,
      studentId
    );
  }

  @Get("trending")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get trending videos feed" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page",
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: "Return trending videos sorted by engagement",
  })
  getTrendingFeed(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @CurrentUser() user?: any
  ) {
    const userId = user?.userId;
    return this.feedVideosService.getTrendingFeed(
      page ? +page : 1,
      limit ? +limit : 20,
      userId
    );
  }

  @Get("my-videos")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get my uploaded videos" })
  @ApiResponse({ status: 200, description: "Return user's videos" })
  getMyVideos(@CurrentUser() user: any) {
    const studentId = user.userId;
    return this.feedVideosService.getMyVideos(studentId);
  }

  @Get(":id")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get video by ID with full details" })
  @ApiParam({ name: "id", description: "Video ID" })
  @ApiResponse({ status: 200, description: "Return video details" })
  @ApiResponse({ status: 404, description: "Video not found" })
  getVideoById(@Param("id") id: string) {
    return this.feedVideosService.getVideoById(+id);
  }

  @Get(":id/stream")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Stream video file with range support" })
  @ApiParam({ name: "id", description: "Video ID" })
  @Header("Accept-Ranges", "bytes")
  @Header("Content-Type", "video/mp4")
  @ApiResponse({
    status: 206,
    description: "Partial content - video streaming with range support",
  })
  @ApiResponse({ status: 200, description: "Full video content" })
  @ApiResponse({ status: 404, description: "Video not found" })
  async streamVideo(
    @Param("id") id: string,
    @Headers() headers,
    @Res() res: Response
  ) {
    // Get video details from database
    const video = await this.feedVideosService.getVideoById(+id);
    if (!video) {
      throw new NotFoundException("Video not found");
    }

    // Extract file path from video URL
    let videoPath: string;
    if (
      video.videoUrl.startsWith("http://") ||
      video.videoUrl.startsWith("https://")
    ) {
      // Parse URL to get path (e.g., /uploads/videos/filename.mp4)
      const url = new URL(video.videoUrl);
      videoPath = `.${url.pathname}`; // Convert to relative path: ./uploads/videos/filename.mp4
    } else if (video.videoUrl.startsWith("/")) {
      // Absolute path from root
      videoPath = `.${video.videoUrl}`;
    } else {
      // Already a relative path
      videoPath = video.videoUrl;
    }

    // Check if file exists
    if (!existsSync(videoPath)) {
      throw new NotFoundException("Video file not found on server");
    }

    const { size } = statSync(videoPath);
    const videoRange = headers.range;

    if (videoRange) {
      // Handle range request (for seeking/progressive download)
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = end - start + 1;

      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); // 206
      readStreamfile.pipe(res);
    } else {
      // Send full video
      const head = {
        "Content-Length": size,
        "Content-Type": "video/mp4",
      };

      res.writeHead(HttpStatus.OK, head); // 200
      createReadStream(videoPath).pipe(res);
    }
  }

  @Post(":id/view")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Increment video view count" })
  @ApiParam({ name: "id", description: "Video ID" })
  @ApiResponse({ status: 200, description: "View count incremented" })
  incrementViewCount(@Param("id") id: string) {
    return this.feedVideosService.incrementViewCount(+id);
  }

  @Delete(":id")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Delete my video" })
  @ApiParam({ name: "id", description: "Video ID" })
  @ApiResponse({ status: 200, description: "Video deleted successfully" })
  @ApiResponse({ status: 403, description: "Can only delete your own videos" })
  @ApiResponse({ status: 404, description: "Video not found" })
  deleteVideo(@Param("id") id: string, @CurrentUser() user: any) {
    const studentId = user.userId;
    return this.feedVideosService.deleteVideo(+id, studentId);
  }

  // ========== LIKES ==========
  @Post(":id/like")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Like or unlike a video" })
  @ApiParam({ name: "id", description: "Video ID" })
  @ApiResponse({
    status: 200,
    description: "Video liked/unliked. Rewards: +1 coin, +2 points",
  })
  @ApiResponse({ status: 404, description: "Video not found" })
  toggleLike(@Param("id") id: string, @CurrentUser() user: any) {
    const userId = user.userId;
    return this.feedVideosService.toggleLike(+id, userId);
  }

  // ========== COMMENTS ==========
  @Post("comments")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Add a comment to a video" })
  @ApiResponse({
    status: 201,
    description: "Comment added. Rewards: +2 coins, +4 points",
  })
  @ApiResponse({ status: 404, description: "Video not found" })
  addComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any
  ) {
    const userId = user.userId;
    return this.feedVideosService.addComment(createCommentDto, userId);
  }

  @Get(":id/comments")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get all comments for a video" })
  @ApiParam({ name: "id", description: "Video ID" })
  @ApiResponse({ status: 200, description: "Return video comments" })
  getVideoComments(@Param("id") id: string) {
    return this.feedVideosService.getVideoComments(+id);
  }

  @Delete("comments/:commentId")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Delete my comment" })
  @ApiParam({ name: "commentId", description: "Comment ID" })
  @ApiResponse({ status: 200, description: "Comment deleted successfully" })
  @ApiResponse({
    status: 403,
    description: "Can only delete your own comments",
  })
  @ApiResponse({ status: 404, description: "Comment not found" })
  deleteComment(
    @Param("commentId") commentId: string,
    @CurrentUser() user: any
  ) {
    const userId = user.userId;
    return this.feedVideosService.deleteComment(+commentId, userId);
  }

  // ========== JUDGE ==========
  @Post("judge")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Judge a video with fluency and clarity scores" })
  @ApiResponse({
    status: 201,
    description: "Judge rating added. Rewards: +5 coins, +10 points",
  })
  @ApiResponse({ status: 400, description: "Already judged this video" })
  @ApiResponse({ status: 404, description: "Video not found" })
  addJudge(@Body() createJudgeDto: CreateJudgeDto, @CurrentUser() user: any) {
    const judgeUserId = user.userId;
    return this.feedVideosService.addJudge(createJudgeDto, judgeUserId);
  }

  @Get(":id/judges")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get all judge ratings for a video" })
  @ApiParam({ name: "id", description: "Video ID" })
  @ApiResponse({
    status: 200,
    description: "Return video judges sorted by helpfulness",
  })
  getVideoJudges(@Param("id") id: string) {
    return this.feedVideosService.getVideoJudges(+id);
  }

  @Post("judge/:judgeId/helpful")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Mark a judge rating as helpful" })
  @ApiParam({ name: "judgeId", description: "Judge ID" })
  @ApiResponse({ status: 200, description: "Judge marked as helpful" })
  @ApiResponse({ status: 404, description: "Judge not found" })
  markJudgeHelpful(@Param("judgeId") judgeId: string) {
    return this.feedVideosService.markJudgeHelpful(+judgeId);
  }

  // ========== NOTIFICATIONS ==========
  @Get("notifications/me")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get my notifications" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of notifications to retrieve",
    example: 20,
  })
  @ApiResponse({ status: 200, description: "Return user notifications" })
  getMyNotifications(@CurrentUser() user: any, @Query("limit") limit?: string) {
    const userId = user.userId;
    return this.feedVideosService.getMyNotifications(
      userId,
      limit ? +limit : 20
    );
  }

  @Patch("notifications/:id/read")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({ status: 200, description: "Notification marked as read" })
  @ApiResponse({ status: 404, description: "Notification not found" })
  markNotificationAsRead(@Param("id") id: string, @CurrentUser() user: any) {
    const userId = user.userId;
    return this.feedVideosService.markNotificationAsRead(+id, userId);
  }

  // ========== VIDEO COMPRESSION ==========
  @Get("compression/status/:jobId")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get compression job status" })
  @ApiParam({ name: "jobId", description: "Compression job ID" })
  @ApiResponse({
    status: 200,
    description: "Return job status and progress",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        state: {
          type: "string",
          enum: ["waiting", "active", "completed", "failed"],
        },
        progress: { type: "object" },
        result: { type: "object" },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Job not found" })
  getCompressionStatus(@Param("jobId") jobId: string) {
    return this.feedVideosService.getCompressionJobStatus(jobId);
  }

  @Sse("compression/progress/:jobId")
  @ApiOperation({
    summary: "Stream compression progress via Server-Sent Events",
    description:
      "Real-time updates of video compression progress. Connect to this endpoint to receive live progress updates.",
  })
  @ApiParam({ name: "jobId", description: "Compression job ID" })
  @ApiResponse({
    status: 200,
    description: "SSE stream of compression progress",
  })
  streamCompressionProgress(
    @Param("jobId") jobId: string
  ): Observable<MessageEvent> {
    return interval(500).pipe(
      switchMap(async () => {
        try {
          const status =
            await this.feedVideosService.getCompressionJobStatus(jobId);
          return status;
        } catch (error) {
          return { error: error.message, state: "error" };
        }
      }),
      takeWhile(
        (status: any) => {
          return !["completed", "failed", "error"].includes(status.state);
        },
        true // Include the final value
      ),
      map(
        (status) =>
          ({
            data: status,
          }) as MessageEvent
      )
    );
  }
}
