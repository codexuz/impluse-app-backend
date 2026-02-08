import { PartialType } from "@nestjs/swagger";
import { CreateListeningPartDto } from "./create-listening-part.dto.js";

export class UpdateListeningPartDto extends PartialType(
  CreateListeningPartDto,
) {}
