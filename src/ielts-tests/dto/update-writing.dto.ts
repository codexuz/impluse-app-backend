import { PartialType } from "@nestjs/swagger";
import { CreateIeltsWritingDto } from "./create-writing.dto.js";

export class UpdateIeltsWritingDto extends PartialType(CreateIeltsWritingDto) {}
