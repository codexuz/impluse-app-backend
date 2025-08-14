import { LessonService } from './lesson.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { Lesson } from './entities/lesson.entity.js';
export declare class LessonController {
    private readonly lessonService;
    constructor(lessonService: LessonService);
    create(createLessonDto: CreateLessonDto): Promise<Lesson>;
    findAll(): Promise<Lesson[]>;
    findMyLessons(student_id: string): Promise<import("../group_assigned_lessons/entities/group_assigned_lesson.entity.js").GroupAssignedLesson[]>;
    findOne(id: string): Promise<Lesson>;
    findWithContent(id: string): Promise<Lesson>;
    findWithVocabulary(id: string): Promise<Lesson>;
    findWithExercise(id: string): Promise<Lesson>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson>;
    remove(id: string): Promise<void>;
    findByUnit(unitId: string, throwIfEmpty?: string): Promise<Lesson[]>;
    findByModule(moduleId: string, includeContent?: string): Promise<Lesson[]>;
    findByModuleWithContent(moduleId: string): Promise<Lesson[]>;
    findByModuleWithExercises(moduleId: string): Promise<Lesson[]>;
    findByModuleWithVocabulary(moduleId: string): Promise<Lesson[]>;
}
