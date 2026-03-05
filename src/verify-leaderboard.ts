
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { IeltsAnswersService } from './ielts-tests/ielts-answers.service.js';
import { LeaderboardPeriod } from './ielts-tests/dto/ielts-leaderboard.dto.js';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const service = app.get(IeltsAnswersService);

    console.log('--- Testing Unified Leaderboard ---');
    try {
        const leaderboard = await service.getLeaderboard({ period: LeaderboardPeriod.ALL_TIME });
        console.log('Leaderboard:', JSON.stringify(leaderboard, null, 2));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }

    await app.close();
}

bootstrap();
