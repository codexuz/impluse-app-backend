var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { OnesignalModule } from '../onesignal/onesignal.module.js';
import { OnesignalService } from '../onesignal/onesignal.service.js';
let NotificationsModule = class NotificationsModule {
};
NotificationsModule = __decorate([
    Module({
        controllers: [NotificationsController],
        providers: [NotificationsService, OnesignalService],
        imports: [OnesignalModule],
    })
], NotificationsModule);
export { NotificationsModule };
//# sourceMappingURL=notifications.module.js.map