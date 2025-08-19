export declare class UserRankingResponseDto {
    rank: number;
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
export declare class LeaderboardItemDto {
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
}
export declare class LeaderboardResponseDto {
    data: LeaderboardItemDto[];
}
