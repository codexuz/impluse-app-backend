import { CreateRoleScenarioDto } from '../../role-scenarios/dto/create-role-scenario.dto.js';
import { CreatePronunciationExerciseDto } from '../../pronunciation-exercise/dto/create-pronunciation-exercise.dto.js';
import { CreateIeltspart1QuestionDto } from '../../ieltspart1-question/dto/create-ieltspart1-question.dto.js';
import { CreateIeltspart2QuestionDto } from '../../ieltspart2-question/dto/create-ieltspart2-question.dto.js';
import { CreateIeltspart3QuestionDto } from '../../ieltspart3-question/dto/create-ieltspart3-question.dto.js';
export declare class CreateSpeakingDto {
    lessonId: string;
    topic: string;
    content: string;
    roleScenarios?: CreateRoleScenarioDto[];
    pronunciationExercises?: CreatePronunciationExerciseDto[];
    ieltspart1Questions?: CreateIeltspart1QuestionDto[];
    ieltspart2Questions?: CreateIeltspart2QuestionDto[];
    ieltspart3Questions?: CreateIeltspart3QuestionDto[];
    instruction: string;
    level: string;
    type: string;
}
