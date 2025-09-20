import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { StudentProfile } from "./entities/student_profile.entity.js";
import { CreateStudentProfileDto } from "./dto/create-student-profile.dto.js";
import { UpdateStudentProfileDto } from "./dto/update-student-profile.dto.js";

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile
  ) {}

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
    return profile.reload();
  }

  async addCoins(userId: string, coins: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment("coins", { by: coins });
    return profile.reload();
  }

  async incrementStreak(userId: string): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment("streaks");
    return profile.reload();
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
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
      ],
    });
  }

  async getLeaderboardByPoints(limit?: number): Promise<StudentProfile[]> {
    const validLimit = limit && limit > 0 ? limit : 10;
    return this.studentProfileModel.findAll({
      order: [["points", "DESC"]],
      limit: validLimit,
      include: [
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
      ],
    });
  }

  async getLeaderboardByLevel(limit?: number): Promise<StudentProfile[]> {
    const validLimit = limit && limit > 0 ? limit : 10;
    return this.studentProfileModel.findAll({
      include: [
        {
          association: "user",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "username",
            "level_id",
          ],
          where: {
            level_id: {
              [Op.ne]: null, // Only include users that have a level_id
            },
          },
        },
      ],
      order: [
        [
          { model: this.studentProfileModel.sequelize.models.User, as: "user" },
          "level_id",
          "DESC",
        ],
        ["points", "DESC"], // Secondary sort by points for users with same level
      ],
      limit: validLimit,
    });
  }

  async getLeaderboardByStreaks(limit?: number): Promise<StudentProfile[]> {
    const validLimit = limit && limit > 0 ? limit : 10;
    return this.studentProfileModel.findAll({
      order: [["streaks", "DESC"]],
      limit: validLimit,
      include: [
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username"],
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
          attributes: ["user_id", "first_name", "last_name", "username"],
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

    const higherRanked = await this.studentProfileModel.count({
      where: {
        points: {
          [Op.gt]: profile.points,
        },
      },
    });

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

    // Count users with higher level
    const higherRanked = await this.studentProfileModel.count({
      include: [
        {
          association: "user",
          where: {
            level_id: {
              [Op.gt]: levelId,
            },
          },
        },
      ],
    });

    // Count users with same level but higher points
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
          },
        },
      ],
    });

    return {
      rank: higherRanked + sameRankedHigherPoints + 1,
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
    });

    return {
      rank: higherRanked + 1,
      profile,
    };
  }
}
