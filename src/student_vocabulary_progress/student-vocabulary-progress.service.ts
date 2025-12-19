import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { StudentVocabularyProgress } from "./entities/student_vocabulary_progress.entity.js";
import { CreateStudentVocabularyProgressDto } from "./dto/create-student-vocabulary-progress.dto.js";
import { UpdateStudentVocabularyProgressDto } from "./dto/update-student-vocabulary-progress.dto.js";
import { VocabularyProgressStatus } from "./enums/vocabulary-progress-status.enum.js";

@Injectable()
export class StudentVocabularyProgressService {
  constructor(
    @InjectModel(StudentVocabularyProgress)
    private studentVocabularyProgressModel: typeof StudentVocabularyProgress
  ) {}

  async create(
    createDto: CreateStudentVocabularyProgressDto
  ): Promise<StudentVocabularyProgress> {
    // Check if vocabulary progress already exists for this student and vocabulary item
    const existingProgress = await this.studentVocabularyProgressModel.findOne({
      where: {
        student_id: createDto.student_id,
        vocabulary_item_id: createDto.vocabulary_item_id,
      },
    });

    if (existingProgress) {
      // Progress exists, update status based on current status
      let newStatus: VocabularyProgressStatus;

      if (existingProgress.status === VocabularyProgressStatus.LEARNING) {
        newStatus = VocabularyProgressStatus.REVIEWING;
      } else if (
        existingProgress.status === VocabularyProgressStatus.REVIEWING
      ) {
        newStatus = VocabularyProgressStatus.MASTERED;
      } else {
        // Already mastered, keep it mastered
        newStatus = VocabularyProgressStatus.MASTERED;
      }

      await existingProgress.update({
        status: newStatus,
        attempts_count: existingProgress.attempts_count + 1,
      });

      return existingProgress;
    }

    // No existing progress, create new record with status 'learning' and attempts_count = 1
    return this.studentVocabularyProgressModel.create({
      ...createDto,
      status: VocabularyProgressStatus.LEARNING,
      attempts_count: 1,
    });
  }

  async findAll(): Promise<StudentVocabularyProgress[]> {
    return this.studentVocabularyProgressModel.findAll();
  }

  async findOne(id: string): Promise<StudentVocabularyProgress> {
    const progress = await this.studentVocabularyProgressModel.findByPk(id);
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async findByStudent(studentId: string): Promise<StudentVocabularyProgress[]> {
    return this.studentVocabularyProgressModel.findAll({
      where: { student_id: studentId },
    });
  }

  async findByVocabularyItem(
    vocabularyItemId: string
  ): Promise<StudentVocabularyProgress[]> {
    return this.studentVocabularyProgressModel.findAll({
      where: { vocabulary_item_id: vocabularyItemId },
    });
  }

  async findByStudentAndVocabularyItem(
    studentId: string,
    vocabularyItemId: string
  ): Promise<StudentVocabularyProgress> {
    const progress = await this.studentVocabularyProgressModel.findOne({
      where: {
        student_id: studentId,
        vocabulary_item_id: vocabularyItemId,
      },
    });
    if (!progress) {
      throw new NotFoundException(
        `Progress not found for student ${studentId} and vocabulary item ${vocabularyItemId}`
      );
    }
    return progress;
  }

  /**
   * Find a word's status for a specific student
   * @param studentId The ID of the student
   * @param vocabularyItemId The ID of the vocabulary item
   * @returns The status of the word or null if no progress record exists
   */
  async findWordStatus(
    studentId: string,
    vocabularyItemId: string
  ): Promise<VocabularyProgressStatus | null> {
    const progress = await this.studentVocabularyProgressModel.findOne({
      where: {
        student_id: studentId,
        vocabulary_item_id: vocabularyItemId,
      },
    });
    return progress ? (progress.status as VocabularyProgressStatus) : null;
  }

  async update(
    id: string,
    updateDto: UpdateStudentVocabularyProgressDto
  ): Promise<StudentVocabularyProgress> {
    const progress = await this.findOne(id);
    await progress.update(updateDto);
    return progress;
  }

  async remove(id: string): Promise<void> {
    const progress = await this.findOne(id);
    await progress.destroy();
  }

  async updateStatus(
    id: string,
    status: VocabularyProgressStatus
  ): Promise<StudentVocabularyProgress> {
    const progress = await this.findOne(id);
    await progress.update({ status });
    return progress;
  }

  /**
   * Update status by vocabulary item ID
   * @param vocabularyItemId The ID of the vocabulary item
   * @param status The new status to set
   * @returns Updated StudentVocabularyProgress record
   */
  async updateStatusByVocabularyItemId(
    vocabularyItemId: string,
    status: VocabularyProgressStatus
  ): Promise<StudentVocabularyProgress[]> {
    const progressRecords = await this.findByVocabularyItem(vocabularyItemId);

    if (progressRecords.length === 0) {
      throw new NotFoundException(
        `No progress records found for vocabulary item ${vocabularyItemId}`
      );
    }

    const updatePromises = progressRecords.map((progress) =>
      progress.update({ status })
    );
    await Promise.all(updatePromises);

    return progressRecords;
  }

  /**
   * Increment attempts count for a vocabulary progress record
   */
  async incrementAttempts(id: string): Promise<StudentVocabularyProgress> {
    const progress = await this.findOne(id);
    await progress.update({
      attempts_count: progress.attempts_count + 1,
    });
    return progress;
  }

  /**
   * Progress vocabulary status logically and increment attempts count
   * learning → reviewing → mastered
   * @param studentId The ID of the student
   * @param vocabularyItemId The ID of the vocabulary item
   * @returns Updated progress record
   */
  async progressVocabularyStatus(
    studentId: string,
    vocabularyItemId: string
  ): Promise<StudentVocabularyProgress> {
    const progress = await this.studentVocabularyProgressModel.findOne({
      where: {
        student_id: studentId,
        vocabulary_item_id: vocabularyItemId,
      },
    });

    if (!progress) {
      // No existing progress, create new record with status 'learning'
      return this.studentVocabularyProgressModel.create({
        student_id: studentId,
        vocabulary_item_id: vocabularyItemId,
        status: VocabularyProgressStatus.LEARNING,
        attempts_count: 1,
      });
    }

    // Determine next status based on current status
    let newStatus: VocabularyProgressStatus;

    if (progress.status === VocabularyProgressStatus.LEARNING) {
      newStatus = VocabularyProgressStatus.REVIEWING;
    } else if (progress.status === VocabularyProgressStatus.REVIEWING) {
      newStatus = VocabularyProgressStatus.MASTERED;
    } else {
      // Already mastered, keep it mastered
      newStatus = VocabularyProgressStatus.MASTERED;
    }

    // Update status and increment attempts count
    await progress.update({
      status: newStatus,
      attempts_count: progress.attempts_count + 1,
    });

    return progress;
  }

  /**
   * Record an attempt for a student and vocabulary item
   * If a record exists, increment the attempts_count
   * If no record exists, create a new one with attempts_count = 1
   */
  async recordAttempt(
    studentId: string,
    vocabularyItemId: string,
    status: VocabularyProgressStatus = VocabularyProgressStatus.LEARNING
  ): Promise<StudentVocabularyProgress> {
    try {
      // Try to find existing record
      const existingProgress = await this.findByStudentAndVocabularyItem(
        studentId,
        vocabularyItemId
      );

      // Increment attempts count
      return this.incrementAttempts(existingProgress.id);
    } catch (error) {
      // If not found, create new record with attempts_count = 1
      return this.create({
        student_id: studentId,
        vocabulary_item_id: vocabularyItemId,
        status: status,
      });
    }
  }

  async getStudentProgressStats(
    studentId: string
  ): Promise<{ [key in VocabularyProgressStatus]: number }> {
    const progress = await this.studentVocabularyProgressModel.findAll({
      where: { student_id: studentId },
    });

    return {
      [VocabularyProgressStatus.LEARNING]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.LEARNING
      ).length,
      [VocabularyProgressStatus.REVIEWING]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.REVIEWING
      ).length,
      [VocabularyProgressStatus.MASTERED]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.MASTERED
      ).length,
    };
  }

  /**
   * Get detailed vocabulary progress statistics for a student
   */
  async getDetailedStudentStats(studentId: string): Promise<{
    totalVocabularyItems: number;
    statusCounts: { [key in VocabularyProgressStatus]: number };
    statusPercentages: { [key in VocabularyProgressStatus]: number };
    completionRate: number;
    masteryRate: number;
    averageAttempts: number;
    totalAttempts: number;
    recentProgress: StudentVocabularyProgress[];
    learningItems: StudentVocabularyProgress[];
    mostAttemptedItems: StudentVocabularyProgress[];
  }> {
    const progress = await this.studentVocabularyProgressModel.findAll({
      where: { student_id: studentId },
      order: [["updatedAt", "DESC"]],
    });

    if (progress.length === 0) {
      return {
        totalVocabularyItems: 0,
        statusCounts: {
          [VocabularyProgressStatus.LEARNING]: 0,
          [VocabularyProgressStatus.REVIEWING]: 0,
          [VocabularyProgressStatus.MASTERED]: 0,
        },
        statusPercentages: {
          [VocabularyProgressStatus.LEARNING]: 0,
          [VocabularyProgressStatus.REVIEWING]: 0,
          [VocabularyProgressStatus.MASTERED]: 0,
        },
        completionRate: 0,
        masteryRate: 0,
        averageAttempts: 0,
        totalAttempts: 0,
        recentProgress: [],
        learningItems: [],
        mostAttemptedItems: [],
      };
    }

    // Count items by status
    const statusCounts = {
      [VocabularyProgressStatus.LEARNING]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.LEARNING
      ).length,
      [VocabularyProgressStatus.REVIEWING]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.REVIEWING
      ).length,
      [VocabularyProgressStatus.MASTERED]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.MASTERED
      ).length,
    };

    const totalItems = progress.length;

    // Calculate percentages
    const statusPercentages = {
      [VocabularyProgressStatus.LEARNING]: Math.round(
        (statusCounts[VocabularyProgressStatus.LEARNING] / totalItems) * 100
      ),
      [VocabularyProgressStatus.REVIEWING]: Math.round(
        (statusCounts[VocabularyProgressStatus.REVIEWING] / totalItems) * 100
      ),
      [VocabularyProgressStatus.MASTERED]: Math.round(
        (statusCounts[VocabularyProgressStatus.MASTERED] / totalItems) * 100
      ),
    };

    // Calculate completion rate (items not in LEARNING status)
    const completedItems =
      statusCounts[VocabularyProgressStatus.REVIEWING] +
      statusCounts[VocabularyProgressStatus.MASTERED];
    const completionRate = Math.round((completedItems / totalItems) * 100);

    // Calculate mastery rate
    const masteryRate = Math.round(
      (statusCounts[VocabularyProgressStatus.MASTERED] / totalItems) * 100
    );

    // Calculate attempts statistics
    const totalAttempts = progress.reduce(
      (sum, item) => sum + item.attempts_count,
      0
    );
    const averageAttempts = Math.round((totalAttempts / totalItems) * 10) / 10;

    // Get recent progress (last 10 updated items)
    const recentProgress = progress.slice(0, 10);

    // Get items still in learning status
    const learningItems = progress
      .filter((p) => p.status === VocabularyProgressStatus.LEARNING)
      .slice(0, 10);

    // Get items with most attempts
    const mostAttemptedItems = [...progress]
      .sort((a, b) => b.attempts_count - a.attempts_count)
      .slice(0, 10);

    return {
      totalVocabularyItems: totalItems,
      statusCounts,
      statusPercentages,
      completionRate,
      masteryRate,
      totalAttempts,
      averageAttempts,
      recentProgress,
      learningItems,
      mostAttemptedItems,
    };
  }

  /**
   * Get progress statistics for a specific vocabulary item across all students
   */
  async getVocabularyItemStats(vocabularyItemId: string): Promise<{
    totalStudents: number;
    statusCounts: { [key in VocabularyProgressStatus]: number };
    statusPercentages: { [key in VocabularyProgressStatus]: number };
    masteryRate: number;
    difficultyScore: number;
    totalAttempts: number;
    averageAttempts: number;
    attemptsToMastery: number;
  }> {
    const progress = await this.studentVocabularyProgressModel.findAll({
      where: { vocabulary_item_id: vocabularyItemId },
    });

    if (progress.length === 0) {
      return {
        totalStudents: 0,
        statusCounts: {
          [VocabularyProgressStatus.LEARNING]: 0,
          [VocabularyProgressStatus.REVIEWING]: 0,
          [VocabularyProgressStatus.MASTERED]: 0,
        },
        statusPercentages: {
          [VocabularyProgressStatus.LEARNING]: 0,
          [VocabularyProgressStatus.REVIEWING]: 0,
          [VocabularyProgressStatus.MASTERED]: 0,
        },
        masteryRate: 0,
        difficultyScore: 0,
        totalAttempts: 0,
        averageAttempts: 0,
        attemptsToMastery: 0,
      };
    }

    // Count students by status
    const statusCounts = {
      [VocabularyProgressStatus.LEARNING]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.LEARNING
      ).length,
      [VocabularyProgressStatus.REVIEWING]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.REVIEWING
      ).length,
      [VocabularyProgressStatus.MASTERED]: progress.filter(
        (p) => p.status === VocabularyProgressStatus.MASTERED
      ).length,
    };

    const totalStudents = progress.length;

    // Calculate percentages
    const statusPercentages = {
      [VocabularyProgressStatus.LEARNING]: Math.round(
        (statusCounts[VocabularyProgressStatus.LEARNING] / totalStudents) * 100
      ),
      [VocabularyProgressStatus.REVIEWING]: Math.round(
        (statusCounts[VocabularyProgressStatus.REVIEWING] / totalStudents) * 100
      ),
      [VocabularyProgressStatus.MASTERED]: Math.round(
        (statusCounts[VocabularyProgressStatus.MASTERED] / totalStudents) * 100
      ),
    };

    // Calculate mastery rate
    const masteryRate = Math.round(
      (statusCounts[VocabularyProgressStatus.MASTERED] / totalStudents) * 100
    );

    // Calculate difficulty score (0-100) based on mastery rate and attempts
    // Lower mastery rate = higher difficulty
    const difficultyScore = Math.round(100 - masteryRate);

    // Calculate attempts statistics
    const totalAttempts = progress.reduce(
      (sum, item) => sum + item.attempts_count,
      0
    );
    const averageAttempts =
      Math.round((totalAttempts / totalStudents) * 10) / 10;

    // Calculate average attempts for mastered items
    const masteredItems = progress.filter(
      (p) => p.status === VocabularyProgressStatus.MASTERED
    );
    const attemptsToMastery =
      masteredItems.length > 0
        ? Math.round(
            (masteredItems.reduce((sum, item) => sum + item.attempts_count, 0) /
              masteredItems.length) *
              10
          ) / 10
        : 0;

    return {
      totalStudents,
      statusCounts,
      statusPercentages,
      masteryRate,
      difficultyScore,
      totalAttempts,
      averageAttempts,
      attemptsToMastery,
    };
  }

  /**
   * Get aggregated statistics across all vocabulary items and students
   */
  async getGlobalStats(): Promise<{
    totalStudents: number;
    totalVocabularyItems: number;
    totalRecords: number;
    globalStatusCounts: { [key in VocabularyProgressStatus]: number };
    globalStatusPercentages: { [key in VocabularyProgressStatus]: number };
    globalMasteryRate: number;
    totalAttempts: number;
    averageAttemptsPerItem: number;
    averageAttemptsToMastery: number;
    mostDifficultItems: Array<{
      vocabularyItemId: string;
      difficultyScore: number;
      masteryRate: number;
      averageAttempts: number;
    }>;
    mostMasteredItems: Array<{
      vocabularyItemId: string;
      masteryRate: number;
      totalStudents: number;
      averageAttempts: number;
    }>;
  }> {
    const allProgress = await this.studentVocabularyProgressModel.findAll();

    if (allProgress.length === 0) {
      return {
        totalStudents: 0,
        totalVocabularyItems: 0,
        totalRecords: 0,
        globalStatusCounts: {
          [VocabularyProgressStatus.LEARNING]: 0,
          [VocabularyProgressStatus.REVIEWING]: 0,
          [VocabularyProgressStatus.MASTERED]: 0,
        },
        globalStatusPercentages: {
          [VocabularyProgressStatus.LEARNING]: 0,
          [VocabularyProgressStatus.REVIEWING]: 0,
          [VocabularyProgressStatus.MASTERED]: 0,
        },
        globalMasteryRate: 0,
        totalAttempts: 0,
        averageAttemptsPerItem: 0,
        averageAttemptsToMastery: 0,
        mostDifficultItems: [],
        mostMasteredItems: [],
      };
    }

    // Get unique counts
    const uniqueStudents = new Set(allProgress.map((p) => p.student_id)).size;
    const uniqueVocabularyItems = new Set(
      allProgress.map((p) => p.vocabulary_item_id)
    ).size;

    // Count by status
    const globalStatusCounts = {
      [VocabularyProgressStatus.LEARNING]: allProgress.filter(
        (p) => p.status === VocabularyProgressStatus.LEARNING
      ).length,
      [VocabularyProgressStatus.REVIEWING]: allProgress.filter(
        (p) => p.status === VocabularyProgressStatus.REVIEWING
      ).length,
      [VocabularyProgressStatus.MASTERED]: allProgress.filter(
        (p) => p.status === VocabularyProgressStatus.MASTERED
      ).length,
    };

    // Calculate percentages
    const totalRecords = allProgress.length;
    const globalStatusPercentages = {
      [VocabularyProgressStatus.LEARNING]: Math.round(
        (globalStatusCounts[VocabularyProgressStatus.LEARNING] / totalRecords) *
          100
      ),
      [VocabularyProgressStatus.REVIEWING]: Math.round(
        (globalStatusCounts[VocabularyProgressStatus.REVIEWING] /
          totalRecords) *
          100
      ),
      [VocabularyProgressStatus.MASTERED]: Math.round(
        (globalStatusCounts[VocabularyProgressStatus.MASTERED] / totalRecords) *
          100
      ),
    };

    // Calculate global mastery rate
    const globalMasteryRate = Math.round(
      (globalStatusCounts[VocabularyProgressStatus.MASTERED] / totalRecords) *
        100
    );

    // Calculate statistics per vocabulary item
    const vocabularyItemStats = new Map();

    // Total attempts across all items
    const totalAttempts = allProgress.reduce(
      (sum, item) => sum + item.attempts_count,
      0
    );

    allProgress.forEach((item) => {
      const vocabId = item.vocabulary_item_id;
      if (!vocabularyItemStats.has(vocabId)) {
        vocabularyItemStats.set(vocabId, {
          totalStudents: 0,
          mastered: 0,
          totalAttempts: 0,
        });
      }

      const stats = vocabularyItemStats.get(vocabId);
      stats.totalStudents++;
      stats.totalAttempts += item.attempts_count;
      if (item.status === VocabularyProgressStatus.MASTERED) {
        stats.mastered++;
      }
    });

    // Calculate difficulty scores and mastery rates for each item
    const itemAnalytics = [];

    vocabularyItemStats.forEach((stats, vocabularyItemId) => {
      const masteryRate = Math.round(
        (stats.mastered / stats.totalStudents) * 100
      );
      // Calculate difficulty score (0-100) based on mastery rate
      // Lower mastery rate = higher difficulty
      const difficultyScore = Math.round(100 - masteryRate);
      // Calculate average attempts for this vocabulary item
      const averageAttempts =
        Math.round((stats.totalAttempts / stats.totalStudents) * 10) / 10;

      itemAnalytics.push({
        vocabularyItemId,
        masteryRate,
        difficultyScore,
        totalStudents: stats.totalStudents,
        averageAttempts,
      });
    });

    // Calculate average attempts per item across all students
    const averageAttemptsPerItem =
      totalRecords > 0
        ? Math.round((totalAttempts / totalRecords) * 10) / 10
        : 0;

    // Calculate average attempts to mastery
    const masteredProgress = allProgress.filter(
      (p) => p.status === VocabularyProgressStatus.MASTERED
    );
    const averageAttemptsToMastery =
      masteredProgress.length > 0
        ? Math.round(
            (masteredProgress.reduce(
              (sum, item) => sum + item.attempts_count,
              0
            ) /
              masteredProgress.length) *
              10
          ) / 10
        : 0;

    // Get most difficult items (highest difficulty score)
    const mostDifficultItems = [...itemAnalytics]
      .sort((a, b) => b.difficultyScore - a.difficultyScore)
      .slice(0, 10)
      .map((item) => ({
        vocabularyItemId: item.vocabularyItemId,
        difficultyScore: item.difficultyScore,
        masteryRate: item.masteryRate,
        averageAttempts: item.averageAttempts,
      }));

    // Get most mastered items (highest mastery rate with at least 5 students)
    const mostMasteredItems = [...itemAnalytics]
      .filter((item) => item.totalStudents >= 5)
      .sort((a, b) => b.masteryRate - a.masteryRate)
      .slice(0, 10)
      .map((item) => ({
        vocabularyItemId: item.vocabularyItemId,
        masteryRate: item.masteryRate,
        totalStudents: item.totalStudents,
        averageAttempts: item.averageAttempts,
      }));

    return {
      totalStudents: uniqueStudents,
      totalVocabularyItems: uniqueVocabularyItems,
      totalRecords,
      globalStatusCounts,
      globalStatusPercentages,
      globalMasteryRate,
      totalAttempts,
      averageAttemptsPerItem,
      averageAttemptsToMastery,
      mostDifficultItems,
      mostMasteredItems,
    };
  }

  /**
   * Get student rankings based on mastery progress
   */
  async getStudentRankings(limit: number = 10): Promise<
    Array<{
      studentId: string;
      totalItems: number;
      masteredItems: number;
      masteryRate: number;
      totalAttempts: number;
      averageAttempts: number;
    }>
  > {
    const allProgress = await this.studentVocabularyProgressModel.findAll();

    if (allProgress.length === 0) {
      return [];
    }

    // Group by student
    const studentStats = new Map();

    allProgress.forEach((item) => {
      const studentId = item.student_id;
      if (!studentStats.has(studentId)) {
        studentStats.set(studentId, {
          totalItems: 0,
          masteredItems: 0,
          totalAttempts: 0,
        });
      }

      const stats = studentStats.get(studentId);
      stats.totalItems++;
      stats.totalAttempts += item.attempts_count;
      if (item.status === VocabularyProgressStatus.MASTERED) {
        stats.masteredItems++;
      }
    });

    // Calculate rankings
    const rankings = [];

    studentStats.forEach((stats, studentId) => {
      const masteryRate = Math.round(
        (stats.masteredItems / stats.totalItems) * 100
      );
      const averageAttempts =
        Math.round((stats.totalAttempts / stats.totalItems) * 10) / 10;

      rankings.push({
        studentId,
        totalItems: stats.totalItems,
        masteredItems: stats.masteredItems,
        masteryRate,
        totalAttempts: stats.totalAttempts,
        averageAttempts,
      });
    });

    // Sort by mastery rate and return top students
    return rankings
      .sort((a, b) => b.masteryRate - a.masteryRate)
      .slice(0, limit);
  }

  /**
   * Get student efficiency rankings based on average attempts to mastery
   */
  async getStudentEfficiencyRankings(limit: number = 10): Promise<
    Array<{
      studentId: string;
      masteredItems: number;
      averageAttemptsToMastery: number;
      efficiency: number;
    }>
  > {
    const allProgress = await this.studentVocabularyProgressModel.findAll({
      where: { status: VocabularyProgressStatus.MASTERED },
    });

    if (allProgress.length === 0) {
      return [];
    }

    // Group by student
    const studentStats = new Map();

    allProgress.forEach((item) => {
      const studentId = item.student_id;
      if (!studentStats.has(studentId)) {
        studentStats.set(studentId, {
          masteredItems: 0,
          totalAttemptsToMastery: 0,
        });
      }

      const stats = studentStats.get(studentId);
      stats.masteredItems++;
      stats.totalAttemptsToMastery += item.attempts_count;
    });

    // Calculate efficiency rankings
    const rankings = [];

    studentStats.forEach((stats, studentId) => {
      // Only include students with at least 5 mastered items for statistical significance
      if (stats.masteredItems >= 5) {
        const averageAttemptsToMastery =
          Math.round(
            (stats.totalAttemptsToMastery / stats.masteredItems) * 10
          ) / 10;
        // Efficiency score: lower attempts = higher score (scale 0-100)
        // Assuming ideal mastery is 1 attempt, and poor mastery is 10+ attempts
        const efficiency = Math.round(
          100 * Math.max(0, Math.min(1, 1 - (averageAttemptsToMastery - 1) / 9))
        );

        rankings.push({
          studentId,
          masteredItems: stats.masteredItems,
          averageAttemptsToMastery,
          efficiency,
        });
      }
    });

    // Sort by efficiency score and return top students
    return rankings.sort((a, b) => b.efficiency - a.efficiency).slice(0, limit);
  }

  /**
   * Get progress trends over time
   */
  async getProgressTrends(days: number = 30): Promise<{
    dailyProgress: Array<{
      date: string;
      newMasteries: number;
      totalMasteries: number;
      cumulativeMasteryRate: number;
    }>;
    weeklyProgress: Array<{
      weekStart: string;
      newMasteries: number;
      totalMasteries: number;
      masteryRate: number;
    }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get all progress updates within the date range
    const progressUpdates = await this.studentVocabularyProgressModel.findAll({
      where: {
        updatedAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        status: VocabularyProgressStatus.MASTERED,
      },
      order: [["updatedAt", "ASC"]],
    });

    // Initialize daily and weekly trackers
    const dailyProgress = new Map();
    const weeklyProgress = new Map();

    // Initialize maps for each day
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      dailyProgress.set(dateStr, {
        newMasteries: 0,
        totalMasteries: 0,
        cumulativeMasteryRate: 0,
      });

      // Get the week start (Monday)
      const weekStart = new Date(date);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      const weekStartStr = weekStart.toISOString().split("T")[0];

      if (!weeklyProgress.has(weekStartStr)) {
        weeklyProgress.set(weekStartStr, {
          newMasteries: 0,
          totalMasteries: 0,
          masteryRate: 0,
        });
      }
    }

    // Process progress data
    let cumulativeMasteries = 0;

    for (const progress of progressUpdates) {
      const dateStr = progress.updatedAt.toISOString().split("T")[0];

      if (dailyProgress.has(dateStr)) {
        const dayData = dailyProgress.get(dateStr);
        dayData.newMasteries++;

        // Get week start
        const date = new Date(dateStr);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(date);
        weekStart.setDate(diff);
        const weekStartStr = weekStart.toISOString().split("T")[0];

        if (weeklyProgress.has(weekStartStr)) {
          const weekData = weeklyProgress.get(weekStartStr);
          weekData.newMasteries++;
        }
      }
    }

    // Calculate totals and rates
    const totalProgressCount =
      await this.studentVocabularyProgressModel.count();

    let dailyTotal = 0;
    const dailyProgressArray = Array.from(dailyProgress.entries()).map(
      ([date, data]) => {
        dailyTotal += data.newMasteries;
        cumulativeMasteries += data.newMasteries;
        const cumulativeMasteryRate =
          totalProgressCount > 0
            ? Math.round(
                (cumulativeMasteries / totalProgressCount) * 100 * 10
              ) / 10
            : 0;

        return {
          date,
          newMasteries: data.newMasteries,
          totalMasteries: dailyTotal,
          cumulativeMasteryRate,
        };
      }
    );

    const weeklyProgressArray = Array.from(weeklyProgress.entries())
      .map(([weekStart, data]) => {
        // Calculate the mastery rate for this week
        const weekTotal = progressUpdates.filter((p) => {
          const progressDate = new Date(p.updatedAt);
          const progressWeekStart = new Date(progressDate);
          const day = progressWeekStart.getDay();
          const diff = progressWeekStart.getDate() - day + (day === 0 ? -6 : 1);
          progressWeekStart.setDate(diff);
          return progressWeekStart.toISOString().split("T")[0] === weekStart;
        }).length;

        const weekMasteryRate =
          totalProgressCount > 0
            ? Math.round((weekTotal / totalProgressCount) * 100 * 10) / 10
            : 0;

        return {
          weekStart,
          newMasteries: data.newMasteries,
          totalMasteries: weekTotal,
          masteryRate: weekMasteryRate,
        };
      })
      .filter((week) => week.newMasteries > 0) // Only keep weeks with activity
      .sort(
        (a, b) =>
          new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
      );

    return {
      dailyProgress: dailyProgressArray,
      weeklyProgress: weeklyProgressArray,
    };
  }
}
