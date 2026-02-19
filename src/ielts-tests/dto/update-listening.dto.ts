import { PartialType } from "@nestjs/swagger";
import { CreateListeningDto } from "./create-listening.dto.js";

export class UpdateListeningDto extends PartialType(CreateListeningDto) {}
