import { PartialType } from "@nestjs/swagger";
import { CreateNotificationTokenDto } from "./create-notification-token.dto.js";

export class UpdateNotificationTokenDto extends PartialType(
  CreateNotificationTokenDto
) {}
