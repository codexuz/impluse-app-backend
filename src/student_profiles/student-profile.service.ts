import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, fn, col } from "sequelize";
import { StudentProfile } from "./entities/student_profile.entity.js";
import { PointsLog } from "./entities/points-log.entity.js";
import { CreateStudentProfileDto } from "./dto/create-student-profile.dto.js";
import { UpdateStudentProfileDto } from "./dto/update-student-profile.dto.js";

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile,
    @InjectModel(PointsLog)
    private pointsLogModel: typeof PointsLog
  ) {}

  /**
   * Start of the current week (Monday 00:00:00, server local time).
   * The weekly leaderboard sums PointsLog rows created at or after this.
   */
  private getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday ... 6 = Saturday
    const diffToMonday = (day + 6) % 7; // days since Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  async create(
    createStudentProfileDto: CreateStudentProfileDto
  ): Promise<StudentProfile> {
    return this.studentProfileModel.create({ ...createStudentProfileDto });
  }

  async findAll(): Promise<StudentProfile[]> {
    return this.studentProfileModel.findAll();
  }

  async findOne(id: string): Promise<StudentProfile> {
    const profile = await this.studentProfileModel.findByPk(id);
    if (!profile) {
      throw new NotFoundException(`Student profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: string): Promise<StudentProfile> {
    const profile = await this.studentProfileModel.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new NotFoundException(
        `Student profile for user ${userId} not found`
      );
    }
    return profile;
  }

  async update(
    id: string,
    updateStudentProfileDto: UpdateStudentProfileDto
  ): Promise<StudentProfile> {
    const profile = await this.findOne(id);
    await profile.update(updateStudentProfileDto);
    return profile;
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    await profile.destroy();
  }

  async addPoints(userId: string, points: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment("points", { by: points });

    // Record the award so time-windowed leaderboards (weekly) can be computed.
    // Denormalize the user's current level for fast weekly-by-level grouping.
    const userRecord = await this.studentProfileModel.sequelize.models.User.findOne(
      {
        where: { user_id: userId },
        attributes: ["level_id"],
      }
    );
    await this.pointsLogModel.create({
      user_id: userId,
      level_id: (userRecord?.get("level_id") as string) ?? null,
      points,
    });

    return profile.reload();
  }

  async addCoins(userId: string, coins: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment("coins", { by: coins });
    return profile.reload();
  }

  /**
   * Deduct coins from a student, refusing the operation if the balance
   * would go negative. Returns the reloaded profile on success.
   */
  async deductCoins(userId: string, coins: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    if (profile.coins < coins) {
      throw new BadRequestException(
        `Insufficient coins: ${profile.coins} available, ${coins} required`
      );
    }
    await profile.decrement("coins", { by: coins });
    return profile.reload();
  }

  async incrementStreak(userId: string): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment("streaks");
    return profile.reload();
  }

  async incrementStreakIfNewDay(userId: string): Promise<{ streakGranted: boolean }> {
    const profile = await this.findByUserId(userId);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (profile.last_active_date === today) {
      return { streakGranted: false };
    }
    await profile.increment('streaks');
    await profile.update({ last_active_date: today });
    return { streakGranted: true };
  }

  async resetStreak(userId: string): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    profile.streaks = 0;
    await profile.save();
    return profile;
  }

  async getLeaderboardByCoins(limit?: number): Promise<StudentProfile[]> {
    const validLimit = limit && limit > 0 ? limit : 10;
    return this.studentProfileModel.findAll({
      order: [["coins", "DESC"]],
      limit: validLimit,
      include: [
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username","avatar_url"],
          where: { is_active: true }, // Only active users
          required: true,
        },
      ],
    });
  }

  async getLeaderboardByPoints(limit?: number): Promise<{
    top3: StudentProfile[];
    leaderboard: StudentProfile[];
  }> {
    const validLimit = limit && limit > 0 ? limit : 10;
    
    // Get all students with points > 0, ordered by points DESC
    const allStudents = await this.studentProfileModel.findAll({
      where: {
        points: {
          [Op.gt]: 0, // Only include students with points greater than zero
        },
      },
      order: [["points", "DESC"]],
      include: [
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username", "level_id", "avatar_url"],
          where: {
            level_id: {
              [Op.ne]: null, // Only include users that have a level_id
            },
            is_active: true, // Only active users
          },
          required: true,
        },
      ],
    });

    // Extract top 3 leaders
    const top3 = allStudents.slice(0, 3);
    
    // Get the specified number for the full leaderboard
    const leaderboard = allStudents.slice(0, validLimit);

    return {
      top3,
      leaderboard,
    };
  }

  /**
   * Weekly leaderboard across all active students: ranks students by the points
   * they earned during the current week (Monday onward), summed from the
   * PointsLog ledger. Students with no points this week are excluded (so only
   * students active this week appear). Not scoped by level.
   */
  async getLeaderboardByLevel(
    limit?: number
  ): Promise<
    Array<{
      user_id: string;
      weekly_points: number;
      user: any;
      profile: StudentProfile | null;
    }>
  > {
    const validLimit = limit && limit > 0 ? limit : 10;
    const weekStart = this.getWeekStart();

    // Sum this week's points per user across all students, highest first.
    const rows = await this.pointsLogModel.findAll({
      attributes: [
        "user_id",
        [fn("SUM", col("points")), "weekly_points"],
      ],
      where: {
        createdAt: { [Op.gte]: weekStart },
      },
      group: ["user_id"],
      order: [[fn("SUM", col("points")), "DESC"]],
      limit: validLimit,
      raw: true,
    });

    if (rows.length === 0) return [];

    // Hydrate each entry with the user record and the (lifetime) profile.
    const userIds = rows.map((r: any) => r.user_id);
    const [users, profiles] = await Promise.all([
      this.studentProfileModel.sequelize.models.User.findAll({
        where: { user_id: { [Op.in]: userIds }, is_active: true }, // Only active users
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "username",
          "level_id",
          "avatar_url",
        ],
      }),
      this.studentProfileModel.findAll({
        where: { user_id: { [Op.in]: userIds } },
      }),
    ]);

    const userById = new Map(users.map((u: any) => [u.get("user_id"), u]));
    const profileByUserId = new Map(profiles.map((p) => [p.user_id, p]));

    // Drop entries whose user is inactive (no active user record).
    return rows
      .filter((r: any) => userById.has(r.user_id))
      .map((r: any) => ({
        user_id: r.user_id,
        weekly_points: Number(r.weekly_points) || 0,
        user: userById.get(r.user_id),
        profile: profileByUserId.get(r.user_id) ?? null,
      }));
  }

  async getLeaderboardByStreaks(limit?: number): Promise<StudentProfile[]> {
    const validLimit = limit && limit > 0 ? limit : 10;
    return this.studentProfileModel.findAll({
      order: [["streaks", "DESC"]],
      limit: validLimit,
      include: [
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username","avatar_url"],
          where: { is_active: true }, // Only active users
          required: true,
        },
      ],
    });
  }

  async getOverallLeaderboard(limit?: number): Promise<StudentProfile[]> {
    const validLimit = limit && limit > 0 ? limit : 10;
    return this.studentProfileModel.findAll({
      order: [
        ["points", "DESC"],
        ["coins", "DESC"],
        ["streaks", "DESC"],
      ],
      limit: validLimit,
      include: [
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username","avatar_url"],
          where: { is_active: true }, // Only active users
          required: true,
        },
      ],
    });
  }

  async getUserRankingByCoins(
    userId: string
  ): Promise<{ rank: number; profile: StudentProfile }> {
    const profile = await this.findByUserId(userId);

    const higherRanked = await this.studentProfileModel.count({
      where: {
        coins: {
          [Op.gt]: profile.coins,
        },
      },
      include: [
        {
          association: "user",
          attributes: [],
          where: { is_active: true }, // Only count active users
          required: true,
        },
      ],
    });

    return {
      rank: higherRanked + 1,
      profile,
    };
  }

  async getUserRankingByPoints(
    userId: string
  ): Promise<{ rank: number; profile: StudentProfile }> {
    const profile = await this.findByUserId(userId);

    // Only count students with points > 0 for ranking
    const higherRanked = await this.studentProfileModel.count({
      where: {
        points: {
          [Op.gt]: profile.points,
        },
      },
      include: [
        {
          association: "user",
          where: {
            level_id: {
              [Op.ne]: null, // Only include users that have a level_id
            },
            is_active: true, // Only count active users
          },
          required: true,
        },
      ],
    });

    // If current user has 0 or negative points, they don't have a valid rank
    if (profile.points <= 0) {
      return {
        rank: 0, // No rank for users with 0 or negative points
        profile,
      };
    }

    return {
      rank: higherRanked + 1,
      profile,
    };
  }

  async getUserRankingByLevel(
    userId: string
  ): Promise<{ rank: number; profile: StudentProfile }> {
    const profile = await this.findByUserId(userId);

    // Get the user to access their level_id
    const userRecord =
      await this.studentProfileModel.sequelize.models.User.findOne({
        where: { user_id: profile.user_id },
        attributes: ["level_id"],
      });

    if (!userRecord || !userRecord.get("level_id")) {
      return {
        rank: 0, // No rank if user has no level
        profile,
      };
    }

    const levelId = userRecord.get("level_id");

    // Count users with same level but higher points only
    const sameRankedHigherPoints = await this.studentProfileModel.count({
      where: {
        points: {
          [Op.gt]: profile.points,
        },
      },
      include: [
        {
          association: "user",
          where: {
            level_id: levelId,
            is_active: true, // Only count active users
          },
          required: true,
        },
      ],
    });

    return {
      rank: sameRankedHigherPoints + 1,
      profile,
    };
  }

  async getUserRankingByStreaks(
    userId: string
  ): Promise<{ rank: number; profile: StudentProfile }> {
    const profile = await this.findByUserId(userId);

    const higherRanked = await this.studentProfileModel.count({
      where: {
        streaks: {
          [Op.gt]: profile.streaks,
        },
      },
      include: [
        {
          association: "user",
          attributes: [],
          where: { is_active: true }, // Only count active users
          required: true,
        },
      ],
    });

    return {
      rank: higherRanked + 1,
      profile,
    };
  }
}
