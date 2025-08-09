var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VideosService } from './videos.service.js';
import { VideosController } from './videos.controller.js';
import { Video } from './entities/video.entity.js';
import { YoutubeCaptionsModule } from '../services/youtube-captions/youtube-captions.module.js';
let VideosModule = class VideosModule {
};
VideosModule = __decorate([
    Module({
        imports: [
            YoutubeCaptionsModule,
            SequelizeModule.forFeature([Video])
        ],
        controllers: [VideosController],
        providers: [VideosService],
        exports: [VideosService],
    })
], VideosModule);
export { VideosModule };
//# sourceMappingURL=videos.module.js.map