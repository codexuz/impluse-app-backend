import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min } from "class-validator";

export class LinkListeningPartDto {
    @ApiProperty({
        description: "The listening section ID to link to",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    listening_id: string;

    @ApiProperty({
        description: "The listening part ID to link",
        example: "123e4567-e89b-12d3-a456-426614174001",
    })
    @IsUUID()
    @IsNotEmpty()
    listening_part_id: string;

    @ApiPropertyOptional({
        description: "Display order for sorting",
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}

export class UnlinkListeningPartDto {
    @ApiProperty({
        description: "The listening section ID to unlink from",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    listening_id: string;

    @ApiProperty({
        description: "The listening part ID to unlink",
        example: "123e4567-e89b-12d3-a456-426614174001",
    })
    @IsUUID()
    @IsNotEmpty()
    listening_part_id: string;
}
