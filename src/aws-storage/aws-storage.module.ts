import { Module } from "@nestjs/common";
import { AwsStorageService } from "./aws-storage.service.js";

@Module({
  providers: [AwsStorageService],
  exports: [AwsStorageService],
})
export class AwsStorageModule {}
