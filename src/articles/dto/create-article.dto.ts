import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    description: "The title of the article",
    example: "Introduction to Node.js",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The category of the article",
    example: "Programming",
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: "The image URL or path for the article",
    example: "https://example.com/images/article.jpg",
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: "The content of the article in JSON format",
    example: {
      sections: [{ type: "paragraph", text: "This is the article content" }],
    },
  })
  @IsNotEmpty()
  content: any;
}
