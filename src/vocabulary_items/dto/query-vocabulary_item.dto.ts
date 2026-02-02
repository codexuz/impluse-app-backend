import { IsOptional, IsString, IsEnum, IsNumberString } from "class-validator";

export enum SortOrder {
  NEWEST = "newest",
  OLDEST = "oldest",
}

export enum MediaFilter {
  WITH_IMAGES = "with_images",
  WITHOUT_IMAGES = "without_images",
  WITH_AUDIOS = "with_audios",
  WITHOUT_AUDIOS = "without_audios",
  WITH_EXAMPLES = "with_examples",
  WITHOUT_EXAMPLES = "without_examples",
}

export class QueryVocabularyItemDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MediaFilter)
  imageFilter?: MediaFilter;

  @IsOptional()
  @IsEnum(MediaFilter)
  audioFilter?: MediaFilter;

  @IsOptional()
  @IsEnum(MediaFilter)
  exampleFilter?: MediaFilter;
}

export interface VocabularyItemStats {
  totalWords: number;
  withImages: number;
  withoutImages: number;
  withAudios: number;
  withoutAudios: number;
  withExamples: number;
  withoutExamples: number;
}

export interface PaginatedVocabularyItemsResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: VocabularyItemStats;
}
