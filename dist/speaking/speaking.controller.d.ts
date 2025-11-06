import { SpeakingService } from './speaking.service.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
export declare class SpeakingController {
    private readonly speakingService;
    constructor(speakingService: SpeakingService);
    create(createSpeakingDto: CreateSpeakingDto): Promise<import("./entities/speaking.entity.js").Speaking>;
    findAll(): Promise<import("./entities/speaking.entity.js").Speaking[]>;
    findByLesson(lessonId: string): Promise<any[]>;
    getByType(type: 'speaking' | 'pronunciation'): Promise<any[]>;
    findByLessonAndType(lessonId: string, type: 'speaking' | 'pronunciation'): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateSpeakingDto: UpdateSpeakingDto): Promise<import("./entities/speaking.entity.js").Speaking>;
    countRelated(id: string): Promise<any>;
    removeRelated(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
