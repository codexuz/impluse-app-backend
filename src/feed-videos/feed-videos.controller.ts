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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
  @ApiOperation({ summary: "Upload a video file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Video upload with file and metadata",
    type: CreateFeedVideoDto,
  })
  @ApiResponse({
    status: 201,
    description: "Video uploaded successfully. Rewards: +15 coins, +25 points",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - invalid file or data",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseInterceptors(FileInterceptor("file"))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateFeedVideoDto,
    @CurrentUser() user: any
  ) {
    if (!file) {
      throw new BadRequestException("Video file is required");
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
    return this.feedVideosService.uploadVideo(file, createVideoDto, studentId);
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
    @Query("limit") limit?: string
  ) {
    return this.feedVideosService.getTrendingFeed(
      page ? +page : 1,
      limit ? +limit : 20
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
}
