import { StudentProfile } from './entities/student_profile.entity.js';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto.js';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto.js';
export declare class StudentProfileService {
    private studentProfileModel;
    constructor(studentProfileModel: typeof StudentProfile);
    create(createStudentProfileDto: CreateStudentProfileDto): Promise<StudentProfile>;
    findAll(): Promise<StudentProfile[]>;
    findOne(id: string): Promise<StudentProfile>;
    findByUserId(userId: string): Promise<StudentProfile>;
    update(id: string, updateStudentProfileDto: UpdateStudentProfileDto): Promise<StudentProfile>;
    remove(id: string): Promise<void>;
    addPoints(userId: string, points: number): Promise<StudentProfile>;
    addCoins(userId: string, coins: number): Promise<StudentProfile>;
    incrementStreak(userId: string): Promise<StudentProfile>;
    resetStreak(userId: string): Promise<StudentProfile>;
    getLeaderboardByCoins(limit?: number): Promise<StudentProfile[]>;
    getLeaderboardByPoints(limit?: number): Promise<StudentProfile[]>;
    getLeaderboardByStreaks(limit?: number): Promise<StudentProfile[]>;
    getOverallLeaderboard(limit?: number): Promise<StudentProfile[]>;
    getUserRankingByCoins(userId: string): Promise<{
        rank: number;
        profile: StudentProfile;
    }>;
    getUserRankingByPoints(userId: string): Promise<{
        rank: number;
        profile: StudentProfile;
    }>;
    getUserRankingByStreaks(userId: string): Promise<{
        rank: number;
        profile: StudentProfile;
    }>;
}
