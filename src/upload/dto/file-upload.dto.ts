import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ example: 'original-filename.pdf' })
  originalName: string;

  @ApiProperty({ example: 'file-1234567890.pdf' })
  filename: string;

  @ApiProperty({ example: 'uploads/file-1234567890.pdf' })
  path: string;

  @ApiProperty({ example: 'http://localhost:3000/uploads/file-1234567890.pdf' })
  url: string;
}
