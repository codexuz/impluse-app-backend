import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min } from "class-validator";

export class LinkReadingPartDto {
    @ApiProperty({
        description: "The reading section ID to link to",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    reading_id: string;

    @ApiProperty({
        description: "The reading part ID to link",
        example: "123e4567-e89b-12d3-a456-426614174001",
    })
    @IsUUID()
    @IsNotEmpty()
    reading_part_id: string;

    @ApiPropertyOptional({
        description: "Display order for sorting",
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}

export class UnlinkReadingPartDto {
    @ApiProperty({
        description: "The reading section ID to unlink from",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    reading_id: string;

    @ApiProperty({
        description: "The reading part ID to unlink",
        example: "123e4567-e89b-12d3-a456-426614174001",
    })
    @IsUUID()
    @IsNotEmpty()
    reading_part_id: string;
}
