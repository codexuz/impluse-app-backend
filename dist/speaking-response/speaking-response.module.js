var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SpeakingResponseService } from "./speaking-response.service.js";
import { SpeakingResponseController } from "./speaking-response.controller.js";
import { SpeakingResponse } from "./entities/speaking-response.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { OpenaiModule } from "../services/openai/openai.module.js";
import { StudentProfileModule } from "../student_profiles/student-profile.module.js";
let SpeakingResponseModule = class SpeakingResponseModule {
};
SpeakingResponseModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([SpeakingResponse, Speaking]),
            OpenaiModule,
            StudentProfileModule,
        ],
        controllers: [SpeakingResponseController],
        providers: [SpeakingResponseService],
        exports: [SpeakingResponseService],
    })
], SpeakingResponseModule);
export { SpeakingResponseModule };
//# sourceMappingURL=speaking-response.module.js.map