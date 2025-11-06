import { Lesson } from './entities/lesson.entity.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { GroupAssignedLesson } from '../group_assigned_lessons/entities/group_assigned_lesson.entity.js';
export declare class LessonService {
    private lessonModel;
    private groupAssignedLessonModel;
    constructor(lessonModel: typeof Lesson, groupAssignedLessonModel: typeof GroupAssignedLesson);
    create(createLessonDto: CreateLessonDto): Promise<Lesson>;
    findAll(): Promise<Lesson[]>;
    findOne(id: string): Promise<Lesson | null>;
    findMyLessons(student_id: string): Promise<GroupAssignedLesson[]>;
    findOneWithContent(id: string): Promise<Lesson | null>;
    findOneWithVocabulary(id: string): Promise<Lesson>;
    findOneWithExercises(id: string): Promise<Lesson>;
    findOneFull(id: string): Promise<Lesson>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson>;
    remove(id: string): Promise<void>;
    findByUnit(unitId: string, throwIfEmpty?: boolean): Promise<Lesson[]>;
    findByModuleId(moduleId: string, includeContent?: boolean): Promise<Lesson[]>;
    findByModuleIdWithExercises(moduleId: string): Promise<Lesson[]>;
    findByModuleIdWithVocabulary(moduleId: string): Promise<Lesson[]>;
}
