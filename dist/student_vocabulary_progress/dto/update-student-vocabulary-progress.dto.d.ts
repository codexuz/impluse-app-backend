import { CreateStudentVocabularyProgressDto } from './create-student-vocabulary-progress.dto.js';
import { VocabularyProgressStatus } from '../enums/vocabulary-progress-status.enum.js';
declare const UpdateStudentVocabularyProgressDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateStudentVocabularyProgressDto>>;
export declare class UpdateStudentVocabularyProgressDto extends UpdateStudentVocabularyProgressDto_base {
    status?: VocabularyProgressStatus;
}
export {};
