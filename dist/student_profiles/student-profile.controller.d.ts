import { StudentProfileService } from "./student-profile.service.js";
import { CreateStudentProfileDto } from "./dto/create-student-profile.dto.js";
import { UpdateStudentProfileDto } from "./dto/update-student-profile.dto.js";
export declare class StudentProfileController {
    private readonly studentProfileService;
    constructor(studentProfileService: StudentProfileService);
    create(createStudentProfileDto: CreateStudentProfileDto): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    findAll(): Promise<import("./entities/student_profile.entity.js").StudentProfile[]>;
    findOne(id: string): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    findByUserId(userId: string): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    update(id: string, updateStudentProfileDto: UpdateStudentProfileDto): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    remove(id: string): Promise<void>;
    addPoints(id: string, amount: number): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    addCoins(id: string, amount: number): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    incrementStreak(id: string): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    resetStreak(id: string): Promise<import("./entities/student_profile.entity.js").StudentProfile>;
    getLeaderboardByCoins(limit?: string): Promise<import("./entities/student_profile.entity.js").StudentProfile[]>;
    getLeaderboardByPoints(limit?: string): Promise<{
        top3: import("./entities/student_profile.entity.js").StudentProfile[];
        leaderboard: import("./entities/student_profile.entity.js").StudentProfile[];
    }>;
    getLeaderboardByLevel(limit?: string, userId?: string): Promise<import("./entities/student_profile.entity.js").StudentProfile[]>;
    getLeaderboardByStreaks(limit?: string): Promise<import("./entities/student_profile.entity.js").StudentProfile[]>;
    getOverallLeaderboard(limit?: string): Promise<import("./entities/student_profile.entity.js").StudentProfile[]>;
    getUserRankingByCoins(userId: string): Promise<{
        rank: number;
        profile: import("./entities/student_profile.entity.js").StudentProfile;
    }>;
    getUserRankingByPoints(userId: string): Promise<{
        rank: number;
        profile: import("./entities/student_profile.entity.js").StudentProfile;
    }>;
    getUserRankingByLevel(userId: string): Promise<{
        rank: number;
        profile: import("./entities/student_profile.entity.js").StudentProfile;
    }>;
    getUserRankingByStreaks(userId: string): Promise<{
        rank: number;
        profile: import("./entities/student_profile.entity.js").StudentProfile;
    }>;
}
