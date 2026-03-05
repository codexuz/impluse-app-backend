
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { IeltsAnswersService } from './ielts-tests/ielts-answers.service.js';
import { LeaderboardType, LeaderboardPeriod } from './ielts-tests/dto/ielts-leaderboard.dto.js';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const service = app.get(IeltsAnswersService);

    console.log('--- Testing Overall Leaderboard ---');
    try {
        const overall = await service.getLeaderboard({ type: LeaderboardType.OVERALL, period: LeaderboardPeriod.ALL_TIME });
        console.log('Overall Leaderboard:', JSON.stringify(overall, null, 2));
    } catch (error) {
        console.error('Error fetching overall leaderboard:', error);
    }

    console.log('\n--- Testing Submitted Attempts Leaderboard ---');
    try {
        const attempts = await service.getLeaderboard({ type: LeaderboardType.SUBMITTED_ATTEMPTS, period: LeaderboardPeriod.ALL_TIME });
        console.log('Submitted Attempts Leaderboard:', JSON.stringify(attempts, null, 2));
    } catch (error) {
        console.error('Error fetching attempts leaderboard:', error);
    }

    await app.close();
}

bootstrap();
