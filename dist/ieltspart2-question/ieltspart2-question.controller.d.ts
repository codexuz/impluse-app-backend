import { Ieltspart2QuestionService } from './ieltspart2-question.service.js';
import { CreateIeltspart2QuestionDto } from './dto/create-ieltspart2-question.dto.js';
import { UpdateIeltspart2QuestionDto } from './dto/update-ieltspart2-question.dto.js';
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
export declare class Ieltspart2QuestionController {
    private readonly ieltspart2QuestionService;
    constructor(ieltspart2QuestionService: Ieltspart2QuestionService);
    create(createIeltspart2QuestionDto: CreateIeltspart2QuestionDto): Promise<Ieltspart2Question>;
    findAll(): Promise<Ieltspart2Question[]>;
    findBySpeaking(speakingId: string): Promise<Ieltspart2Question[]>;
    findOne(id: string): Promise<Ieltspart2Question>;
    update(id: string, updateIeltspart2QuestionDto: UpdateIeltspart2QuestionDto): Promise<Ieltspart2Question>;
    remove(id: string): Promise<void>;
}
