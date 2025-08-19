import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
import { CreateIeltspart2QuestionDto } from './dto/create-ieltspart2-question.dto.js';
import { UpdateIeltspart2QuestionDto } from './dto/update-ieltspart2-question.dto.js';
export declare class Ieltspart2QuestionService {
    private ieltspart2QuestionModel;
    constructor(ieltspart2QuestionModel: typeof Ieltspart2Question);
    create(createIeltspart2QuestionDto: CreateIeltspart2QuestionDto): Promise<Ieltspart2Question>;
    findAll(): Promise<Ieltspart2Question[]>;
    findOne(id: string): Promise<Ieltspart2Question>;
    findBySpeakingId(speakingId: string): Promise<Ieltspart2Question[]>;
    update(id: string, updateIeltspart2QuestionDto: UpdateIeltspart2QuestionDto): Promise<Ieltspart2Question>;
    remove(id: string): Promise<void>;
}
