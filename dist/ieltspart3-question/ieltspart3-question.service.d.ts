import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
import { CreateIeltspart3QuestionDto } from './dto/create-ieltspart3-question.dto.js';
import { UpdateIeltspart3QuestionDto } from './dto/update-ieltspart3-question.dto.js';
export declare class Ieltspart3QuestionService {
    private ieltspart3QuestionModel;
    constructor(ieltspart3QuestionModel: typeof Ieltspart3Question);
    create(createIeltspart3QuestionDto: CreateIeltspart3QuestionDto): Promise<Ieltspart3Question>;
    findAll(): Promise<Ieltspart3Question[]>;
    findOne(id: string): Promise<Ieltspart3Question>;
    findBySpeakingId(speakingId: string): Promise<Ieltspart3Question[]>;
    update(id: string, updateIeltspart3QuestionDto: UpdateIeltspart3QuestionDto): Promise<Ieltspart3Question>;
    remove(id: string): Promise<void>;
}
