var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service.js';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto.js';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let UserNotificationsController = class UserNotificationsController {
    constructor(userNotificationsService) {
        this.userNotificationsService = userNotificationsService;
    }
    create(createUserNotificationDto) {
        return this.userNotificationsService.create(createUserNotificationDto);
    }
    findAll(userId) {
        if (userId) {
            return this.userNotificationsService.findAllByUserId(userId);
        }
        return this.userNotificationsService.findAll();
    }
    findOne(id) {
        return this.userNotificationsService.findOne(id);
    }
    update(id, updateUserNotificationDto) {
        return this.userNotificationsService.update(id, updateUserNotificationDto);
    }
    markAsSeen(id) {
        return this.userNotificationsService.markAsSeen(id);
    }
    remove(id) {
        return this.userNotificationsService.remove(id);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserNotificationDto]),
    __metadata("design:returntype", void 0)
], UserNotificationsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserNotificationsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserNotificationsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserNotificationDto]),
    __metadata("design:returntype", void 0)
], UserNotificationsController.prototype, "update", null);
__decorate([
    Patch(':id/mark-seen'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserNotificationsController.prototype, "markAsSeen", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserNotificationsController.prototype, "remove", null);
UserNotificationsController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('user-notifications'),
    __metadata("design:paramtypes", [UserNotificationsService])
], UserNotificationsController);
export { UserNotificationsController };
//# sourceMappingURL=user-notifications.controller.js.map