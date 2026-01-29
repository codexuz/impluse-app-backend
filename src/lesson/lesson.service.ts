import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Lesson } from "./entities/lesson.entity.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { LessonContent } from "../lesson-content/entities/lesson-content.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { CreateLessonDto } from "./dto/create-lesson.dto.js";
import { UpdateLessonDto } from "./dto/update-lesson.dto.js";
import { LessonVocabularySet } from "../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js";
import { VocabularySet } from "../vocabulary_sets/entities/vocabulary_set.entity.js";
import { VocabularyItem } from "../vocabulary_items/entities/vocabulary_item.entity.js";
import { GroupAssignedLesson } from "../group_assigned_lessons/entities/group_assigned_lesson.entity.js";

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson)
    private lessonModel: typeof Lesson,
    @InjectModel(GroupAssignedLesson)
    private groupAssignedLessonModel: typeof GroupAssignedLesson,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const lesson = await this.lessonModel.create({
      ...createLessonDto,
      isActive: true,
    });

    return lesson;
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel.findAll({
      where: {
        isActive: true,
      },
      order: [["createdAt", "ASC"]],
    });
  }

  async findOne(id: string): Promise<Lesson | null> {
    const lesson = await this.lessonModel.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: LessonContent,
          as: "lessonContents",
        },
        {
          model: Exercise,
          as: "exercises",
        },
        {
          model: Speaking,
          as: "speaking",
        },
      ],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async findMyLessons(student_id: string): Promise<GroupAssignedLesson[]> {
    return await this.groupAssignedLessonModel.findAll({
      where: { student_id },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          where: { isActive: true },
        },
      ],
    });
  }

  async findOneWithContent(id: string): Promise<Lesson | null> {
    const lesson = await this.lessonModel.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: LessonContent,
          as: "lessonContents",
        },
      ],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async findOneWithVocabulary(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: LessonVocabularySet,
          as: "lessonVocabularySets",
          include: [
            {
              model: VocabularySet,
              as: "vocabularySet",
              include: [
                {
                  model: VocabularyItem,
                  as: "vocabularyItems",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async findOneWithExercises(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: Exercise,
          as: "exercises",
        },
      ],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  /**
   * Return a lesson with its theory content, exercises, speaking items and
   * lesson vocabulary. Uses the association aliases defined in src/models/index.ts
   */
  async findOneFull(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: LessonContent,
          as: "theory",
        },
        {
          model: Exercise,
          as: "exercises",
          attributes: ["id", "exercise_type", "lessonId"],
        },
        {
          model: Speaking,
          as: "speaking",
          attributes: ["id", "lessonId"],
        },
        {
          model: LessonVocabularySet,
          as: "lesson_vocabulary",
          attributes: ["id", "lesson_id"],
        },
      ],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);
    await lesson.update(updateLessonDto);
    return lesson;
  }

  async remove(id: string): Promise<void> {
    const affected = await this.lessonModel.update(
      { isActive: false },
      { where: { id, isActive: true } },
    );

    if (affected[0] === 0) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
  }

  async findByUnit(
    unitId: string,
    throwIfEmpty: boolean = false,
  ): Promise<Lesson[]> {
    if (!unitId) {
      throw new Error("Unit ID is required");
    }

    try {
      const lessons = await this.lessonModel.findAll({
        where: {
          moduleId: unitId,
          isActive: true,
        },
        order: [["order", "ASC"]],
        include: [
          {
            model: LessonContent,
            as: "lessonContents",
          },
        ],
      });

      if (!lessons.length && throwIfEmpty) {
        throw new NotFoundException(`No lessons found for unit ID ${unitId}`);
      }

      return lessons;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to fetch lessons for unit ${unitId}: ${error.message}`,
      );
    }
  }

  async findByModuleId(
    moduleId: string,
    includeContent: boolean = false,
  ): Promise<Lesson[]> {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    const includeOptions = [];

    if (includeContent) {
      includeOptions.push({
        model: LessonContent,
        as: "lessonContents",
      });
    }

    const lessons = await this.lessonModel.findAll({
      where: {
        moduleId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: includeOptions,
    });

    return lessons;
  }

  async findByModuleIdWithExercises(moduleId: string): Promise<Lesson[]> {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    const lessons = await this.lessonModel.findAll({
      where: {
        moduleId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: [
        {
          model: Exercise,
          as: "exercises",
        },
      ],
    });

    return lessons;
  }

  async findByModuleIdWithVocabulary(moduleId: string): Promise<Lesson[]> {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    const lessons = await this.lessonModel.findAll({
      where: {
        moduleId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: [
        {
          model: LessonVocabularySet,
          as: "lessonVocabularySets",
          include: [
            {
              model: VocabularySet,
              as: "vocabularySet",
              include: [
                {
                  model: VocabularyItem,
                  as: "vocabularyItems",
                },
              ],
            },
          ],
        },
      ],
    });

    return lessons;
  }
}
