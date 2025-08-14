import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
import { CreateIeltspart3QuestionDto } from './dto/create-ieltspart3-question.dto.js';
import { UpdateIeltspart3QuestionDto } from './dto/update-ieltspart3-question.dto.js';

@Injectable()
export class Ieltspart3QuestionService {
    constructor(
        @InjectModel(Ieltspart3Question)
        private ieltspart3QuestionModel: typeof Ieltspart3Question,
    ) {}

    async create(createIeltspart3QuestionDto: CreateIeltspart3QuestionDto): Promise<Ieltspart3Question> {
        return await this.ieltspart3QuestionModel.create({ ...createIeltspart3QuestionDto });
    }

    async findAll(): Promise<Ieltspart3Question[]> {
        return await this.ieltspart3QuestionModel.findAll();
    }

    async findOne(id: string): Promise<Ieltspart3Question> {
        const question = await this.ieltspart3QuestionModel.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException(`IELTS Part 3 question with ID ${id} not found`);
        }
        return question;
    }

    async findBySpeakingId(speakingId: string): Promise<Ieltspart3Question[]> {
        return await this.ieltspart3QuestionModel.findAll({
            where: { speaking_id: speakingId }
        });
    }

    async update(id: string, updateIeltspart3QuestionDto: UpdateIeltspart3QuestionDto): Promise<Ieltspart3Question> {
        const question = await this.findOne(id);
        await question.update(updateIeltspart3QuestionDto);
        return question;
    }

    async remove(id: string): Promise<void> {
        const question = await this.findOne(id);
        await question.destroy();
    }
}
