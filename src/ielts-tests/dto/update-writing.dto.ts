import { PartialType } from "@nestjs/swagger";
import { CreateWritingDto } from "./create-writing.dto.js";

export class UpdateWritingDto extends PartialType(CreateWritingDto) {}
