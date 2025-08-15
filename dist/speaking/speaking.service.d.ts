import { Speaking } from './entities/speaking.entity.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
import { RoleScenario } from '../role-scenarios/entities/role-scenario.entity.js';
import { PronunciationExercise } from '../pronunciation-exercise/entities/pronunciation-exercise.entity.js';
import { Ieltspart1Question } from '../ieltspart1-question/entities/ieltspart1-question.entity.js';
import { Ieltspart2Question } from '../ieltspart2-question/entities/ieltspart2-question.entity.js';
import { Ieltspart3Question } from '../ieltspart3-question/entities/ieltspart3-question.entity.js';
export declare class SpeakingService {
    private speakingModel;
    private roleScenarioModel;
    private pronunciationModel;
    private ieltspart1Model;
    private ieltspart2Model;
    private ieltspart3Model;
    constructor(speakingModel: typeof Speaking, roleScenarioModel: typeof RoleScenario, pronunciationModel: typeof PronunciationExercise, ieltspart1Model: typeof Ieltspart1Question, ieltspart2Model: typeof Ieltspart2Question, ieltspart3Model: typeof Ieltspart3Question);
    create(createSpeakingDto: CreateSpeakingDto): Promise<Speaking>;
    findAll(): Promise<Speaking[]>;
    findOne(id: string): Promise<Speaking>;
    update(id: string, updateSpeakingDto: UpdateSpeakingDto): Promise<Speaking>;
    remove(id: string): Promise<void>;
}
