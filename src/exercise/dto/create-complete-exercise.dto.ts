import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsEnum,
  IsInt,
  IsUrl,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export enum ExerciseType {
  GRAMMAR = "grammar",
  READING = "reading",
  LISTENING = "listening",
  WRITING = "writing",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  FILL_IN_THE_BLANK = "fill_in_the_blank",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  MATCHING = "matching",
  SENTENCE_BUILD = "sentence_build",
  TRANSLATION = "translation",
  DICTATION = "dictation",
  LISTEN_AND_CHOOSE = "listen_and_choose",
}
// Dictation DTO
export class CreateDictationDto {
  @ApiProperty({
    description: "Audio URL for the dictation",
    example: "https://example.com/audio.mp3",
    required: true,
  })
  @IsString({ message: "audio must be a string" })
  @IsNotEmpty({ message: "audio should not be empty" })
  audio: string;

  @ApiProperty({
    description: "Correct answer for the dictation",
    example: "The weather is nice today",
    required: true,
  })
  @IsString({ message: "correct_answer must be a string" })
  @IsNotEmpty({ message: "correct_answer should not be empty" })
  correct_answer: string;
}

// Listen and Choose Option DTO
export class CreateListenAndChooseOptionDto {
  @ApiProperty({
    description: "Option text",
    example: "apple",
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: "Whether this option is correct",
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_correct: boolean;
}

// Listen and Choose DTO
export class CreateListenAndChooseDto {
  @ApiProperty({
    description: "Audio URL for listen and choose",
    example: "https://example.com/audio.mp3",
    required: true,
  })
  @IsString({ message: "audio must be a string" })
  @IsNotEmpty({ message: "audio should not be empty" })
  audio: string;

  @ApiProperty({
    description: "Options for listen and choose",
    type: [CreateListenAndChooseOptionDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateListenAndChooseOptionDto)
  @IsNotEmpty()
  options: CreateListenAndChooseOptionDto[];
}

// Translation DTO
export class CreateTranslationDto {
  @ApiProperty({
    description: "Text given to the student to translate",
    example: "The cat is sitting on the table",
    required: true,
  })
  @IsString({ message: "given_text must be a string" })
  @IsNotEmpty({ message: "given_text should not be empty" })
  given_text: string;

  @ApiProperty({
    description: "Correct translation answer",
    example: "Mushuk stol ustida o'tiribdi",
    required: true,
  })
  @IsString({ message: "correct_answer must be a string" })
  @IsNotEmpty({ message: "correct_answer should not be empty" })
  correct_answer: string;
}

// Sentence Build DTO
export class CreateSentenceBuildDto {
  @ApiProperty({
    description: "Text given to the student to build the sentence",
    example: "the dog brown quick jumps over the lazy fox",
    required: true,
  })
  @IsString({ message: "given_text must be a string" })
  @IsNotEmpty({ message: "given_text should not be empty" })
  given_text: string;

  @ApiProperty({
    description: "Correct answer for the sentence build",
    example: "The quick brown fox jumps over the lazy dog",
    required: true,
  })
  @IsString({ message: "correct_answer must be a string" })
  @IsNotEmpty({ message: "correct_answer should not be empty" })
  correct_answer: string;
}

// Base Exercise DTO
export class CreateExerciseDto {
  @ApiProperty({
    description: "Title of the exercise",
    example: "Present Simple Grammar Exercise",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Type of the exercise",
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR,
  })
  @IsEnum(ExerciseType)
  @IsNotEmpty()
  exercise_type: ExerciseType;

  @ApiProperty({
    description: "Audio URL for the exercise",
    required: false,
    example: "https://example.com/audio.mp3",
  })
  @IsUrl()
  @IsOptional()
  audio_url?: string;

  @ApiProperty({
    description: "Image URL for the exercise",
    required: false,
    example: "https://example.com/image.jpg",
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: "Video URL for the exercise",
    required: false,
    example: "https://example.com/video.mp4",
  })
  @IsUrl()
  @IsOptional()
  video_url?: string;

  @ApiProperty({
    description: "Instructions for the exercise",
    required: false,
    example: "Choose the correct answer",
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({
    description: "Content of the exercise",
    required: false,
    example: "She ___ to school every day.",
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "Whether the exercise is active",
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "ID of the lesson this exercise belongs to",
    required: false,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  lessonId?: string;
}

// Question DTO
export class CreateQuestionDto {
  @ApiProperty({
    description: "Type of the question",
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  question_type: QuestionType;

  @ApiProperty({
    description: "Question text",
    example: "What is the correct form of the verb?",
  })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiProperty({
    description: "Points awarded for this question",
    required: false,
    example: 10,
  })
  @IsInt()
  @IsOptional()
  points?: number;

  @ApiProperty({
    description: "Order number of the question",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  order_number: number;

  @ApiProperty({
    description: "Sample answer for the question",
    required: false,
    example: 'The correct answer is "goes" because...',
  })
  @IsString()
  @IsOptional()
  sample_answer?: string;
}

// Choice DTO for multiple choice questions
export class CreateChoiceDto {
  @ApiProperty({
    description: "Option text",
    example: "goes",
  })
  @IsString()
  @IsNotEmpty()
  option_text: string;

  @ApiProperty({
    description: "Whether this option is correct",
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_correct: boolean;
}

// Gap Filling DTO
export class CreateGapFillingDto {
  @ApiProperty({
    description: "Gap number in the question",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  gap_number: number;

  @ApiProperty({
    description: "Correct answers for the gap",
    example: ["goes", "is going"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  correct_answer: string[];
}

// Matching Exercise DTO
export class CreateMatchingPairDto {
  @ApiProperty({
    description: "Left side item",
    example: "cat",
  })
  @IsString()
  @IsNotEmpty()
  left_item: string;

  @ApiProperty({
    description: "Right side item",
    example: "animal",
  })
  @IsString()
  @IsNotEmpty()
  right_item: string;
}

// Typing Exercise DTO
export class CreateTypingExerciseDto {
  @ApiProperty({
    description: "Correct answer for typing exercise",
    example: "The quick brown fox jumps over the lazy dog",
  })
  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @ApiProperty({
    description: "Whether the answer is case sensitive",
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_case_sensitive: boolean;
}

// Complete Question DTO that includes all possible question data
export class CreateCompleteQuestionDto extends CreateQuestionDto {
  @ApiProperty({
    description: "Choices for multiple choice questions",
    required: false,
    type: [CreateChoiceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChoiceDto)
  @IsOptional()
  choices?: CreateChoiceDto[];

  @ApiProperty({
    description: "Gap filling data for fill in the blank questions",
    required: false,
    type: [CreateGapFillingDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGapFillingDto)
  @IsOptional()
  gap_filling?: CreateGapFillingDto[];

  @ApiProperty({
    description: "Matching pairs for matching questions",
    required: false,
    type: [CreateMatchingPairDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchingPairDto)
  @IsOptional()
  matching_pairs?: CreateMatchingPairDto[];

  @ApiProperty({
    description: "Typing exercise data for typing questions",
    required: false,
    type: CreateTypingExerciseDto,
  })
  @ValidateNested()
  @Type(() => CreateTypingExerciseDto)
  @IsOptional()
  typing_exercise?: CreateTypingExerciseDto;

  @ApiProperty({
    description: "Sentence build data for sentence build questions",
    required: false,
    type: CreateSentenceBuildDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSentenceBuildDto)
  @IsOptional()
  sentence_build?: CreateSentenceBuildDto | CreateSentenceBuildDto[];

  @ApiProperty({
    description: "Translation data for translation questions",
    required: false,
    type: CreateTranslationDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  @IsOptional()
  translation?: CreateTranslationDto | CreateTranslationDto[];

  @ApiProperty({
    description: "Dictation data for dictation questions",
    required: false,
    type: CreateDictationDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateDictationDto)
  @IsOptional()
  dictation?: CreateDictationDto | CreateDictationDto[];

  @ApiProperty({
    description: "Listen and choose data for listen_and_choose questions",
    required: false,
    type: CreateListenAndChooseDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateListenAndChooseDto)
  @IsOptional()
  listen_and_choose?: CreateListenAndChooseDto | CreateListenAndChooseDto[];
}

// Complete Exercise Creation DTO
export class CreateCompleteExerciseDto extends CreateExerciseDto {
  @ApiProperty({
    description: "Questions for this exercise",
    type: [CreateCompleteQuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompleteQuestionDto)
  @IsNotEmpty()
  questions: CreateCompleteQuestionDto[];
}
