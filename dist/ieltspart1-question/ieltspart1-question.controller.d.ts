import { Ieltspart1QuestionService } from './ieltspart1-question.service.js';
import { CreateIeltspart1QuestionDto } from './dto/create-ieltspart1-question.dto.js';
import { UpdateIeltspart1QuestionDto } from './dto/update-ieltspart1-question.dto.js';
import { Ieltspart1Question } from './entities/ieltspart1-question.entity.js';
export declare class Ieltspart1QuestionController {
    private readonly ieltspart1QuestionService;
    constructor(ieltspart1QuestionService: Ieltspart1QuestionService);
    create(createIeltspart1QuestionDto: CreateIeltspart1QuestionDto): Promise<Ieltspart1Question>;
    findAll(): Promise<Ieltspart1Question[]>;
    findBySpeaking(speakingId: string): Promise<Ieltspart1Question[]>;
    findOne(id: string): Promise<Ieltspart1Question>;
    update(id: string, updateIeltspart1QuestionDto: UpdateIeltspart1QuestionDto): Promise<Ieltspart1Question>;
    remove(id: string): Promise<void>;
}
