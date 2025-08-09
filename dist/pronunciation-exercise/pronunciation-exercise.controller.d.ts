import { PronunciationExerciseService } from './pronunciation-exercise.service.js';
import { CreatePronunciationExerciseDto } from './dto/create-pronunciation-exercise.dto.js';
import { UpdatePronunciationExerciseDto } from './dto/update-pronunciation-exercise.dto.js';
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';
export declare class PronunciationExerciseController {
    private readonly pronunciationExerciseService;
    constructor(pronunciationExerciseService: PronunciationExerciseService);
    create(createPronunciationExerciseDto: CreatePronunciationExerciseDto): Promise<PronunciationExercise>;
    findAll(): Promise<PronunciationExercise[]>;
    findOne(id: string): Promise<PronunciationExercise>;
    findBySpeakingId(speaking_id: string): Promise<PronunciationExercise[]>;
    update(id: string, updatePronunciationExerciseDto: UpdatePronunciationExerciseDto): Promise<PronunciationExercise>;
    remove(id: string): Promise<void>;
}
