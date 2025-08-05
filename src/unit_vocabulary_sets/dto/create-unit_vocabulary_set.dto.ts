import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateUnitVocabularySetDto {
    @IsUUID()
    @IsNotEmpty()
    unit_id: string;

    @IsUUID()
    @IsNotEmpty()
    vocabulary_item_id: string;
}
