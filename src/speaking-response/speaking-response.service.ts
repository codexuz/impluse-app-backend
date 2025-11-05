import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateSpeakingResponseDto } from "./dto/create-speaking-response.dto.js";
import { UpdateSpeakingResponseDto } from "./dto/update-speaking-response.dto.js";
import { SpeakingResponse } from "./entities/speaking-response.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { OpenaiService } from "../services/openai/openai.service.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";

// Define the interface for the exercise details we'll return
export interface ExerciseDetail {
  id: string;
  speaking_id: string;
  completed: boolean;
  response_type: string;
  pronunciation_score: number;
  feedback: string;
  result: any;
  transcription: string;
}

@Injectable()
export class SpeakingResponseService {
  constructor(
    @InjectModel(SpeakingResponse)
    private speakingResponseModel: typeof SpeakingResponse,
    @InjectModel(Speaking)
    private speakingModel: typeof Speaking,
    private readonly openaiService: OpenaiService,
    private readonly studentProfileService: StudentProfileService
  ) {}

  async create(
    createSpeakingResponseDto: CreateSpeakingResponseDto
  ): Promise<SpeakingResponse> {
    let assessmentResult = null;
    let pronunciationScore = 0;

    // Check if response_type is not "pronunciation" and transcription exists
    if (
      createSpeakingResponseDto.response_type !== "pronunciation" &&
      createSpeakingResponseDto.transcription
    ) {
      try {
        // Use OpenAI service to assess the speaking response
        assessmentResult = await this.openaiService.assessSpeaking(
          createSpeakingResponseDto.transcription
        );

        // Calculate the average score from OpenAI assessment
        if (assessmentResult && assessmentResult.speakingAssessment) {
          const { fluency, grammar, vocabulary, pronunciation } =
            assessmentResult.speakingAssessment;
          pronunciationScore = Math.round(
            (fluency + grammar + vocabulary + pronunciation) / 4
          );
        }
      } catch (error) {
        console.error("Error assessing speaking response:", error);
        // Continue with creation even if assessment fails
      }
    }

    // Create the speaking response with calculated pronunciation_score
    const speakingResponse = await this.speakingResponseModel.create({
      ...createSpeakingResponseDto,
      pronunciation_score: pronunciationScore,
      result: assessmentResult || null,
    });

    // Add rewards if score is 80% or higher and student_id exists
    if (pronunciationScore >= 80 && createSpeakingResponseDto.student_id) {
      try {
        // Add coins (e.g., 10 coins for good performance)
        await this.studentProfileService.addCoins(
          createSpeakingResponseDto.student_id,
          10
        );

        // Add points (e.g., 50 points for good performance)
        await this.studentProfileService.addPoints(
          createSpeakingResponseDto.student_id,
          50
        );

        // Increment streak
        await this.studentProfileService.incrementStreak(
          createSpeakingResponseDto.student_id
        );
      } catch (error) {
        console.error("Error adding rewards:", error);
        // Continue even if rewards fail to prevent blocking the main operation
      }
    }

    return speakingResponse;
  }

  async findAll(): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll();
  }

  async findOne(id: string): Promise<SpeakingResponse> {
    const response = await this.speakingResponseModel.findByPk(id);
    if (!response) {
      throw new NotFoundException(`Speaking response with ID ${id} not found`);
    }
    return response;
  }

  async findBySpeakingId(speakingId: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll({
      where: {
        speaking_id: speakingId,
      },
      include: [
        {
          model: Speaking,
          as: "speaking",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findByType(responseType: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll({
      where: {
        response_type: responseType,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async findByStudentId(studentId: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll({
      where: {
        student_id: studentId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async checkSubmission(
    lessonId: string,
    studentId: string
  ): Promise<ExerciseDetail[]> {
    // First, find all speaking exercises for the given lesson
    const speakingExercises = await this.speakingModel.findAll({
      where: {
        lessonId: lessonId,
      },
      attributes: ["id"],
    });

    // If no speaking exercises found for this lesson, return empty array
    if (speakingExercises.length === 0) {
      return [];
    }

    // Extract speaking exercise IDs
    const speakingIds = speakingExercises.map((exercise) => exercise.id);

    // Find all speaking responses for these speaking exercises and the student
    const responses = await this.speakingResponseModel.findAll({
      where: {
        speaking_id: speakingIds,
        student_id: studentId,
      },
    });

    // Create a map of responses by speaking_id for quick lookup
    const responseMap = new Map<string, SpeakingResponse>();
    responses.forEach((response) => {
      responseMap.set(response.speaking_id, response);
    });

    // Build the result array with exercise details
    const exerciseDetails: ExerciseDetail[] = speakingExercises.map(
      (exercise) => {
        const response = responseMap.get(exercise.id);

        return {
          id: response?.id || null,
          speaking_id: exercise.id,
          completed: !!response,
          response_type: response?.response_type || null,
          pronunciation_score: response?.pronunciation_score || null,
          feedback: response?.feedback || null,
          result: response?.result || null,
          transcription: response?.transcription || null,
        };
      }
    );

    return exerciseDetails;
  }

  async update(
    id: string,
    updateSpeakingResponseDto: UpdateSpeakingResponseDto
  ): Promise<SpeakingResponse> {
    const response = await this.findOne(id);
    await response.update(updateSpeakingResponseDto);
    return response;
  }

  async remove(id: string): Promise<void> {
    const response = await this.findOne(id);
    await response.destroy();
  }
}
