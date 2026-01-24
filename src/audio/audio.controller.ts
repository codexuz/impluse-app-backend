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
import { AudioService } from "./audio.service.js";
import {
  CreateAudioDto,
  CreateTaskDto,
  CreateCommentDto,
  CreateJudgeDto,
} from "./dto/create-audio-barrel.dto.js";
import { UpdateAudioDto } from "./dto/update-audio.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@ApiTags("Audio")
@Controller("audio")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  // ========== SSE EVENTS ==========
  @Sse("new-audios/stream")
  @ApiOperation({
    summary: "Server-Sent Events stream for new audio uploads",
    description:
      "Subscribe to real-time notifications when new audios are uploaded",
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
  streamNewAudios(
    @Headers() headers: any,
    @CurrentUser() user: any,
  ): Observable<MessageEvent> {
    // Create an observable that listens for audio upload events
    return new Observable<MessageEvent>((observer) => {
      const eventHandler = (data: any) => {
        // Don't send notification to the uploader themselves
        if (data.uploader.id !== user.userId) {
          const event: MessageEvent = {
            data: JSON.stringify(data),
            type: "new-audio",
            id: Date.now().toString(),
          };
          observer.next(event);
        }
      };

      // Listen for audio upload events
      this.audioService.onAudioUploaded(eventHandler);

      // Cleanup when client disconnects
      return () => {
        this.audioService.removeAudioUploadListener(eventHandler);
      };
    });
  }

  // ========== TASK MANAGEMENT (Admin) ==========
  @Post("tasks")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new audio task for students" })
  @ApiResponse({ status: 201, description: "Task created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  createTask(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    const adminId = user.userId;
    return this.audioService.createTask(createTaskDto, adminId);
  }

  @Get("tasks")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all audio tasks" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 20)",
    type: Number,
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "difficulty",
    required: false,
    description: "Filter by difficulty (easy|medium|hard)",
    enum: ["easy", "medium", "hard"],
  })
  @ApiResponse({ status: 200, description: "Return all tasks with pagination" })
  getAllTasks(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
    @Query("status") status?: string,
    @Query("difficulty") difficulty?: string,
  ) {
    const pageNum = page ? +page : 1;
    const limitNum = limit ? +limit : 20;
    return this.audioService.getAllTasks(pageNum, limitNum, status, difficulty);
  }

  @Get("tasks/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get task by ID" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Return task details" })
  @ApiResponse({ status: 404, description: "Task not found" })
  getTaskById(@Param("id") id: string) {
    const taskId = parseInt(id);
    if (isNaN(taskId) || taskId <= 0) {
      throw new BadRequestException("Invalid task ID");
    }
    return this.audioService.getTaskById(taskId);
  }

  @Patch("tasks/:id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a task" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Task updated successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  updateTask(
    @Param("id") id: string,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
  ) {
    const taskId = parseInt(id);
    if (isNaN(taskId) || taskId <= 0) {
      throw new BadRequestException("Invalid task ID");
    }
    return this.audioService.updateTask(taskId, updateTaskDto);
  }

  @Get("tasks/:taskId/audios")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all audios for a specific task" })
  @ApiParam({ name: "taskId", description: "Task ID" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiResponse({ status: 200, description: "Return audios for task" })
  getTaskAudios(
    @Param("taskId") taskId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.audioService.getTaskAudios(
      +taskId,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Get("tasks/:taskId/check-done")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Check if user has completed a task" })
  @ApiParam({ name: "taskId", description: "Task ID" })
  @ApiResponse({
    status: 200,
    description: "Return task completion status",
    schema: {
      type: "object",
      properties: {
        taskId: { type: "number", example: 1 },
        userId: { type: "string", example: "123" },
        isDone: { type: "boolean", example: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid task ID" })
  async isTaskDoneByUser(
    @Param("taskId") taskId: string,
    @CurrentUser() user: any,
  ) {
    const taskIdNum = parseInt(taskId);
    if (isNaN(taskIdNum) || taskIdNum <= 0) {
      throw new BadRequestException("Invalid task ID");
    }

    const isDone = await this.audioService.isTaskDoneByUser(
      taskIdNum,
      user.userId,
    );

    return {
      taskId: taskIdNum,
      userId: user.userId,
      isDone,
    };
  }

  // ========== AUDIO MANAGEMENT (Student) ==========
  @Post("upload")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({
    summary: "Upload an audio file",
    description:
      "Uploads an audio file and queues it for processing. Returns job ID for tracking progress via SSE.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Audio upload with file and metadata",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Audio file",
        },
        caption: {
          type: "string",
          description: "Audio caption",
          example: "My speaking practice audio",
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
    description: "Audio uploaded and queued for processing",
    schema: {
      type: "object",
      properties: {
        audioId: { type: "number", example: 123 },
        jobId: { type: "string", example: "1" },
        status: { type: "string", example: "processing" },
        message: {
          type: "string",
          example: "Audio uploaded and queued for processing",
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
        destination: "./uploads/audios",
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
      fileFilter: (req, file, cb) => {
        // Allow audio files
        const allowedMimeTypes = [
          "audio/mpeg",
          "audio/mp3",
          "audio/wav",
          "audio/wave",
          "audio/x-wav",
          "audio/m4a",
          "audio/x-m4a",
          "audio/mp4",
          "audio/aac",
          "audio/ogg",
          "audio/webm",
        ];
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtensions = [
          ".mp3",
          ".wav",
          ".m4a",
          ".aac",
          ".ogg",
          ".webm",
        ];

        if (
          allowedMimeTypes.includes(file.mimetype) ||
          allowedExtensions.includes(ext)
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              "Invalid file type. Only audio files are allowed (mp3, wav, m4a, aac, ogg, webm).",
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body("caption") caption: string,
    @Body("taskId") taskId: string,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException("Audio file is required");
    }

    if (!caption) {
      throw new BadRequestException("Audio caption is required");
    }

    // Validate file type (audio only)
    const allowedMimeTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4",
      "audio/aac",
      "audio/ogg",
      "audio/webm",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only audio files are allowed.",
      );
    }

    const studentId = user.userId;
    const createAudioDto: CreateAudioDto = {
      caption,
      taskId: taskId ? +taskId : undefined,
    };
    return this.audioService.uploadAudio(file, createAudioDto, studentId);
  }

  @Get("trending")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get trending audios feed" })
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
    description: "Return trending audios sorted by engagement",
  })
  getTrendingFeed(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @CurrentUser() user?: any,
  ) {
    const userId = user?.userId;
    return this.audioService.getTrendingFeed(
      page ? +page : 1,
      limit ? +limit : 20,
      userId,
    );
  }

  @Get("my-audios")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get my uploaded audios" })
  @ApiResponse({ status: 200, description: "Return user's audios" })
  getMyAudios(@CurrentUser() user: any) {
    const studentId = user.userId;
    return this.audioService.getMyAudios(studentId);
  }

  @Get(":id")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get audio by ID with full details" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({ status: 200, description: "Return audio details" })
  @ApiResponse({ status: 404, description: "Audio not found" })
  getAudioById(@Param("id") id: string) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }
    return this.audioService.getAudioById(audioId);
  }

  @Get(":id/stream")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Stream audio file with range support" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @Header("Accept-Ranges", "bytes")
  @Header("Content-Type", "audio/mpeg")
  @ApiResponse({
    status: 206,
    description: "Partial content - audio streaming with range support",
  })
  @ApiResponse({ status: 200, description: "Full audio content" })
  @ApiResponse({ status: 404, description: "Audio not found" })
  async streamAudio(
    @Param("id") id: string,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }

    // Get audio details from database
    const audio = await this.audioService.getAudioById(audioId);
    if (!audio) {
      throw new NotFoundException("Audio not found");
    }

    // Extract file path from audio URL
    let audioPath: string;
    if (
      audio.audioUrl.startsWith("http://") ||
      audio.audioUrl.startsWith("https://")
    ) {
      // Parse URL to get path (e.g., /uploads/audios/filename.mp3)
      const url = new URL(audio.audioUrl);
      audioPath = `.${url.pathname}`; // Convert to relative path: ./uploads/audios/filename.mp3
    } else if (audio.audioUrl.startsWith("/")) {
      // Absolute path from root
      audioPath = `.${audio.audioUrl}`;
    } else {
      // Already a relative path
      audioPath = audio.audioUrl;
    }

    // Check if file exists
    if (!existsSync(audioPath)) {
      throw new NotFoundException("Audio file not found on server");
    }

    const { size } = statSync(audioPath);
    const audioRange = headers.range;

    if (audioRange) {
      // Handle range request (for seeking/progressive download)
      const parts = audioRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = end - start + 1;

      const readStreamfile = createReadStream(audioPath, {
        start,
        end,
        highWaterMark: 60,
      });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      };

      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); // 206
      readStreamfile.pipe(res);
    } else {
      // Send full audio
      const head = {
        "Content-Length": size,
        "Content-Type": "audio/mpeg",
      };

      res.writeHead(HttpStatus.OK, head); // 200
      createReadStream(audioPath).pipe(res);
    }
  }

  @Post(":id/view")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Increment audio view count" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({ status: 200, description: "View count incremented" })
  incrementViewCount(@Param("id") id: string) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }
    return this.audioService.incrementViewCount(audioId);
  }

  @Delete(":id")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Delete my audio" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({ status: 200, description: "Audio deleted successfully" })
  @ApiResponse({ status: 403, description: "Can only delete your own audios" })
  @ApiResponse({ status: 404, description: "Audio not found" })
  deleteAudio(@Param("id") id: string, @CurrentUser() user: any) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }
    const studentId = user.userId;
    return this.audioService.deleteAudio(audioId, studentId);
  }

  // ========== LIKES ==========
  @Post(":id/like")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Like or unlike an audio" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({
    status: 200,
    description: "Audio liked/unliked. Rewards: +1 coin, +2 points",
  })
  @ApiResponse({ status: 404, description: "Audio not found" })
  toggleLike(@Param("id") id: string, @CurrentUser() user: any) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }
    const userId = user.userId;
    return this.audioService.toggleLike(audioId, userId);
  }

  // ========== COMMENTS ==========
  @Post("comments")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Add a comment to an audio" })
  @ApiResponse({
    status: 201,
    description: "Comment added. Rewards: +2 coins, +4 points",
  })
  @ApiResponse({ status: 404, description: "Audio not found" })
  addComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    const userId = user.userId;
    return this.audioService.addComment(createCommentDto, userId);
  }

  @Get(":id/comments")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get all comments for an audio" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({ status: 200, description: "Return audio comments" })
  getAudioComments(@Param("id") id: string) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }
    return this.audioService.getAudioComments(audioId);
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
    @CurrentUser() user: any,
  ) {
    const userId = user.userId;
    return this.audioService.deleteComment(+commentId, userId);
  }

  // ========== JUDGE ==========
  @Post("judge")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Judge an audio with rating (0-5)" })
  @ApiResponse({
    status: 201,
    description: "Judge rating added. Rewards: +5 coins, +10 points",
  })
  @ApiResponse({ status: 400, description: "Already judged this audio" })
  @ApiResponse({ status: 404, description: "Audio not found" })
  addJudge(@Body() createJudgeDto: CreateJudgeDto, @CurrentUser() user: any) {
    const judgeUserId = user.userId;
    return this.audioService.addJudge(createJudgeDto, judgeUserId);
  }

  @Get(":id/judges")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get all judge ratings for an audio" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({
    status: 200,
    description: "Return audio judges sorted by helpfulness",
  })
  getAudioJudges(@Param("id") id: string) {
    const audioId = parseInt(id);
    if (isNaN(audioId) || audioId <= 0) {
      throw new BadRequestException("Invalid audio ID");
    }
    return this.audioService.getAudioJudges(audioId);
  }
}
