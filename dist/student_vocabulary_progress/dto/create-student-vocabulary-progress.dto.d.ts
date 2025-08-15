import { VocabularyProgressStatus } from '../enums/vocabulary-progress-status.enum.js';
export declare class CreateStudentVocabularyProgressDto {
    student_id: string;
    vocabulary_item_id: string;
    status: VocabularyProgressStatus;
}
