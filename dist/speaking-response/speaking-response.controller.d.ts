import { SpeakingResponseService } from './speaking-response.service.js';
import { CreateSpeakingResponseDto } from './dto/create-speaking-response.dto.js';
import { UpdateSpeakingResponseDto } from './dto/update-speaking-response.dto.js';
import { SpeakingResponse } from './entities/speaking-response.entity.js';
export declare class SpeakingResponseController {
    private readonly speakingResponseService;
    constructor(speakingResponseService: SpeakingResponseService);
    create(createSpeakingResponseDto: CreateSpeakingResponseDto): Promise<SpeakingResponse>;
    findAll(): Promise<SpeakingResponse[]>;
    findBySpeakingId(speakingId: string): Promise<SpeakingResponse[]>;
    findByType(responseType: string): Promise<SpeakingResponse[]>;
    findByStudentId(studentId: string): Promise<SpeakingResponse[]>;
    checkSubmission(lessonId: string, studentId: string): Promise<any[]>;
    findOne(id: string): Promise<SpeakingResponse>;
    update(id: string, updateSpeakingResponseDto: UpdateSpeakingResponseDto): Promise<SpeakingResponse>;
    remove(id: string): Promise<void>;
}
