var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StoriesService } from './stories.service.js';
import { StoriesController } from './stories.controller.js';
import { Story } from './entities/story.entity.js';
let StoriesModule = class StoriesModule {
};
StoriesModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([Story])],
        controllers: [StoriesController],
        providers: [StoriesService],
        exports: [StoriesService],
    })
], StoriesModule);
export { StoriesModule };
//# sourceMappingURL=stories.module.js.map