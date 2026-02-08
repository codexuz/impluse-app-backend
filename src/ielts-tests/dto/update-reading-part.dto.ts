import { PartialType } from "@nestjs/swagger";
import { CreateReadingPartDto } from "./create-reading-part.dto.js";

export class UpdateReadingPartDto extends PartialType(CreateReadingPartDto) {}
