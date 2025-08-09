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

@Module({
  imports: [
    SequelizeModule.forFeature([GroupChat, Messages, GroupChatMembers]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY') || '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService, ChatGateway],
  exports: [ChatGateway, GroupChatService],
})
export class GroupChatModule {}
