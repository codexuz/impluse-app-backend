import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUnitVocabularySetDto {
    @IsUUID()
    @IsNotEmpty()
    vocabulary_set_id: string;

    @IsString()
    @IsOptional()
    title?: string;
}
