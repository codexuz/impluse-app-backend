import { ExerciseService } from './exercise.service.js';
import { CreateCompleteExerciseDto } from './dto/create-complete-exercise.dto.js';
import { UpdateExerciseDto } from './dto/update-complete-exercise.dto.js';
import { Exercise } from './entities/exercise.entity.js';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    create(createExerciseDto: CreateCompleteExerciseDto): Promise<Exercise>;
    findAll(): Promise<Exercise[]>;
    findByLessonId(lessonId: string): Promise<Exercise[]>;
    findByType(exerciseType: string): Promise<Exercise[]>;
    findByTypeAndLessonId(exerciseType: string, lessonId: string): Promise<Exercise[]>;
    findOne(id: string): Promise<Exercise>;
    getQuestionsForExercise(exerciseId: string): Promise<import("./entities/questions.js").Questions[]>;
    update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise>;
    remove(id: string): Promise<void>;
}
