var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupChatService } from './group-chat.service.js';
import { GroupChatController } from './group-chat.controller.js';
import { ChatGateway } from './chat-gateway.js';
import { GroupChat } from './entities/group-chat.entity.js';
import { Messages } from './entities/messages.js';
import { GroupChatMembers } from './entities/chat_group_members.js';
let GroupChatModule = class GroupChatModule {
};
GroupChatModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([GroupChat, Messages, GroupChatMembers]),
            JwtModule.registerAsync({
                imports: [ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRY') || '1h',
                    },
                }),
                inject: [ConfigService],
            }),
        ],
        controllers: [GroupChatController],
        providers: [GroupChatService, ChatGateway],
        exports: [ChatGateway, GroupChatService],
    })
], GroupChatModule);
export { GroupChatModule };
//# sourceMappingURL=group-chat.module.js.map