import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
import { CreateIeltspart2QuestionDto } from './dto/create-ieltspart2-question.dto.js';
import { UpdateIeltspart2QuestionDto } from './dto/update-ieltspart2-question.dto.js';

@Injectable()
export class Ieltspart2QuestionService {
    constructor(
        @InjectModel(Ieltspart2Question)
        private ieltspart2QuestionModel: typeof Ieltspart2Question,
    ) {}

    async create(createIeltspart2QuestionDto: CreateIeltspart2QuestionDto): Promise<Ieltspart2Question> {
        return await this.ieltspart2QuestionModel.create({ ...createIeltspart2QuestionDto });
    }

    async findAll(): Promise<Ieltspart2Question[]> {
        return await this.ieltspart2QuestionModel.findAll();
    }

    async findOne(id: string): Promise<Ieltspart2Question> {
        const question = await this.ieltspart2QuestionModel.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException(`IELTS Part 2 question with ID ${id} not found`);
        }
        return question;
    }

    async findBySpeakingId(speakingId: string): Promise<Ieltspart2Question[]> {
        return await this.ieltspart2QuestionModel.findAll({
            where: { speaking_id: speakingId }
        });
    }

    async update(id: string, updateIeltspart2QuestionDto: UpdateIeltspart2QuestionDto): Promise<Ieltspart2Question> {
        const question = await this.findOne(id);
        await question.update(updateIeltspart2QuestionDto);
        return question;
    }

    async remove(id: string): Promise<void> {
        const question = await this.findOne(id);
        await question.destroy();
    }
}
