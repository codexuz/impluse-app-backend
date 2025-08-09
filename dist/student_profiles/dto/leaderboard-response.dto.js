var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
export class UserRankingResponseDto {
}
__decorate([
    ApiProperty({ description: 'User rank position' }),
    __metadata("design:type", Number)
], UserRankingResponseDto.prototype, "rank", void 0);
__decorate([
    ApiProperty({ description: 'Student profile data' }),
    __metadata("design:type", Object)
], UserRankingResponseDto.prototype, "profile", void 0);
export class LeaderboardItemDto {
}
__decorate([
    ApiProperty({ description: 'Profile ID' }),
    __metadata("design:type", String)
], LeaderboardItemDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'User ID' }),
    __metadata("design:type", String)
], LeaderboardItemDto.prototype, "user_id", void 0);
__decorate([
    ApiProperty({ description: 'Number of coins' }),
    __metadata("design:type", Number)
], LeaderboardItemDto.prototype, "coins", void 0);
__decorate([
    ApiProperty({ description: 'Number of points' }),
    __metadata("design:type", Number)
], LeaderboardItemDto.prototype, "points", void 0);
__decorate([
    ApiProperty({ description: 'Current streak count' }),
    __metadata("design:type", Number)
], LeaderboardItemDto.prototype, "streaks", void 0);
__decorate([
    ApiProperty({ description: 'Profile creation date' }),
    __metadata("design:type", Date)
], LeaderboardItemDto.prototype, "created_at", void 0);
__decorate([
    ApiProperty({ description: 'Profile last update date' }),
    __metadata("design:type", Date)
], LeaderboardItemDto.prototype, "updated_at", void 0);
__decorate([
    ApiProperty({ description: 'Associated user information', required: false }),
    __metadata("design:type", Object)
], LeaderboardItemDto.prototype, "user", void 0);
export class LeaderboardResponseDto {
}
__decorate([
    ApiProperty({
        description: 'List of student profiles in leaderboard order',
        type: [LeaderboardItemDto]
    }),
    __metadata("design:type", Array)
], LeaderboardResponseDto.prototype, "data", void 0);
//# sourceMappingURL=leaderboard-response.dto.js.map