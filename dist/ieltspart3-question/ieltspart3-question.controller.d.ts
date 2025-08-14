import { Ieltspart3QuestionService } from './ieltspart3-question.service.js';
import { CreateIeltspart3QuestionDto } from './dto/create-ieltspart3-question.dto.js';
import { UpdateIeltspart3QuestionDto } from './dto/update-ieltspart3-question.dto.js';
import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
export declare class Ieltspart3QuestionController {
    private readonly ieltspart3QuestionService;
    constructor(ieltspart3QuestionService: Ieltspart3QuestionService);
    create(createIeltspart3QuestionDto: CreateIeltspart3QuestionDto): Promise<Ieltspart3Question>;
    findAll(): Promise<Ieltspart3Question[]>;
    findBySpeaking(speakingId: string): Promise<Ieltspart3Question[]>;
    findOne(id: string): Promise<Ieltspart3Question>;
    update(id: string, updateIeltspart3QuestionDto: UpdateIeltspart3QuestionDto): Promise<Ieltspart3Question>;
    remove(id: string): Promise<void>;
}
