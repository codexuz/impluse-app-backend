import { PartialType } from "@nestjs/swagger";
import { CreateReadingDto } from "./create-reading.dto.js";

export class UpdateReadingDto extends PartialType(CreateReadingDto) {}
