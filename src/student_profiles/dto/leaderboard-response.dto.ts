import { ApiProperty } from '@nestjs/swagger';

export class UserRankingResponseDto {
  @ApiProperty({ description: 'User rank position' })
  rank: number;

  @ApiProperty({ description: 'Student profile data' })
  profile: {
    id: string;
    user_id: string;
    coins: number;
    points: number;
    streaks: number;
    created_at: Date;
    updated_at: Date;
    user?: {
      id: string;
      first_name: string;
      last_name: string;
    };
  };
}

export class LeaderboardItemDto {
  @ApiProperty({ description: 'Profile ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Number of coins' })
  coins: number;

  @ApiProperty({ description: 'Number of points' })
  points: number;

  @ApiProperty({ description: 'Current streak count' })
  streaks: number;

  @ApiProperty({ description: 'Profile creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Profile last update date' })
  updated_at: Date;

  @ApiProperty({ description: 'Associated user information', required: false })
  user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export class LeaderboardResponseDto {
  @ApiProperty({ 
    description: 'List of student profiles in leaderboard order',
    type: [LeaderboardItemDto]
  })
  data: LeaderboardItemDto[];
}
