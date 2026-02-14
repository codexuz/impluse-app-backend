import { PartialType } from "@nestjs/swagger";
import { CreateWritingTaskDto } from "./create-writing-task.dto.js";

export class UpdateWritingTaskDto extends PartialType(CreateWritingTaskDto) {}
