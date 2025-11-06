import { CreateSpeakingResponseDto } from "./dto/create-speaking-response.dto.js";
import { UpdateSpeakingResponseDto } from "./dto/update-speaking-response.dto.js";
import { SpeakingResponse } from "./entities/speaking-response.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { OpenaiService } from "../services/openai/openai.service.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";
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
export declare class SpeakingResponseService {
    private speakingResponseModel;
    private speakingModel;
    private readonly openaiService;
    private readonly studentProfileService;
    constructor(speakingResponseModel: typeof SpeakingResponse, speakingModel: typeof Speaking, openaiService: OpenaiService, studentProfileService: StudentProfileService);
    create(createSpeakingResponseDto: CreateSpeakingResponseDto): Promise<SpeakingResponse>;
    findAll(): Promise<SpeakingResponse[]>;
    findOne(id: string): Promise<SpeakingResponse>;
    findBySpeakingId(speakingId: string): Promise<SpeakingResponse[]>;
    findByType(responseType: string): Promise<SpeakingResponse[]>;
    findByStudentId(studentId: string): Promise<SpeakingResponse[]>;
    checkSubmission(lessonId: string, studentId: string): Promise<ExerciseDetail[]>;
    update(id: string, updateSpeakingResponseDto: UpdateSpeakingResponseDto): Promise<SpeakingResponse>;
    remove(id: string): Promise<void>;
}
