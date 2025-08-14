import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';
import { HomeworkSubmission } from '../homework_submissions/entities/homework_submission.entity.js';
import { GroupHomework } from '../group_homeworks/entities/group_homework.entity.js';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectModel(LessonProgress)
    private lessonProgressModel: typeof LessonProgress,
    @InjectModel(HomeworkSubmission)
    private homeworkSubmissionModel: typeof HomeworkSubmission,
    @InjectModel(GroupHomework)
    private groupHomeworkModel: typeof GroupHomework,
  ) {}

  async create(createLessonProgressDto: CreateLessonProgressDto): Promise<LessonProgress> {
    return this.lessonProgressModel.create({ ...createLessonProgressDto });
  }

  async findAll(): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll();
  }

  async findOne(id: string): Promise<LessonProgress> {
    const lessonProgress = await this.lessonProgressModel.findByPk(id);
    if (!lessonProgress) {
      throw new NotFoundException('Lesson progress not found');
    }
    return lessonProgress;
  }

  async findByStudentId(studentId: string): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      where: { student_id: studentId }
    });
  }

  async findByLessonId(lessonId: string): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      where: { lesson_id: lessonId }
    });
  }

  async findByStudentAndLesson(studentId: string, lessonId: string): Promise<LessonProgress | null> {
    return this.lessonProgressModel.findOne({
      where: { student_id: studentId, lesson_id: lessonId }
    });
  }

  async getOrCreateProgress(studentId: string, lessonId: string): Promise<LessonProgress> {
    let progress = await this.findByStudentAndLesson(studentId, lessonId);
    
    if (!progress) {
      progress = await this.create({
        student_id: studentId,
        lesson_id: lessonId,
        completed: false,
        progress_percentage: 0,
        reading_completed: false,
        listening_completed: false,
        grammar_completed: false,
        writing_completed: false,
        speaking_completed: false,
      });
    }
    
    return progress;
  }

  async updateSectionProgress(studentId: string, lessonId: string, section: string): Promise<LessonProgress> {
    const progress = await this.getOrCreateProgress(studentId, lessonId);
    
    const sectionField = `${section}_completed` as keyof LessonProgress;
    
    // Update the specific section completion status
    const updateData: any = {};
    updateData[sectionField] = true;
    
    await progress.update(updateData);
    
    // Recalculate overall progress
    return this.recalculateProgress(progress);
  }

  async recalculateProgress(progress: LessonProgress): Promise<LessonProgress> {
    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    let completedCount = 0;
    
    for (const section of sections) {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      if (progress[sectionField]) {
        completedCount++;
      }
    }
    
    const progressPercentage = (completedCount / sections.length) * 100;
    const isCompleted = completedCount === sections.length;
    
    await progress.update({
      completed_sections_count: completedCount,
      progress_percentage: progressPercentage,
      completed: isCompleted,
    });
    
    return progress;
  }

  async updateProgressFromHomeworkSubmission(studentId: string, homeworkId: string, section: string): Promise<LessonProgress | null> {
    // Check if the submission is passed and get its data
    const submission = await this.homeworkSubmissionModel.findOne({
      where: {
        student_id: studentId,
        homework_id: homeworkId,
        section: section,
        status: 'passed'
      }
    });
    
    if (!submission) {
      return null;
    }
    
    // If submission has lesson_id directly, use it
    if (submission.lesson_id) {
      return this.updateSectionProgress(studentId, submission.lesson_id, section);
    }
    
    // Otherwise, find the lesson associated with this homework (fallback)
    const homework = await this.groupHomeworkModel.findByPk(homeworkId);
    if (!homework) {
      return null;
    }
    
    // Update lesson progress for this section
    return this.updateSectionProgress(studentId, homework.lesson_id, section);
  }

  async getProgressByLessonAndStudent(studentId: string, lessonId: string): Promise<{
    progress: LessonProgress | null;
    completedSections: string[];
    remainingSections: string[];
    progressPercentage: number;
  }> {
    const progress = await this.findByStudentAndLesson(studentId, lessonId);
    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    
    if (!progress) {
      return {
        progress: null,
        completedSections: [],
        remainingSections: sections,
        progressPercentage: 0,
      };
    }
    
    const completedSections = sections.filter(section => {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      return progress[sectionField];
    });
    
    const remainingSections = sections.filter(section => {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      return !progress[sectionField];
    });
    
    return {
      progress,
      completedSections,
      remainingSections,
      progressPercentage: Number(progress.progress_percentage) || 0,
    };
  }

  async getStudentOverallProgress(studentId: string): Promise<{
    totalLessons: number;
    completedLessons: number;
    inProgressLessons: number;
    overallPercentage: number;
    progressDetails: LessonProgress[];
  }> {
    const progressDetails = await this.findByStudentId(studentId);
    const completedLessons = progressDetails.filter(p => p.completed).length;
    const inProgressLessons = progressDetails.filter(p => !p.completed && Number(p.progress_percentage) > 0).length;
    
    const totalProgress = progressDetails.reduce((sum, p) => sum + Number(p.progress_percentage), 0);
    const overallPercentage = progressDetails.length > 0 ? totalProgress / progressDetails.length : 0;
    
    return {
      totalLessons: progressDetails.length,
      completedLessons,
      inProgressLessons,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      progressDetails,
    };
  }

  async update(id: string, updateLessonProgressDto: UpdateLessonProgressDto): Promise<LessonProgress> {
    const lessonProgress = await this.findOne(id);
    await lessonProgress.update(updateLessonProgressDto);
    return lessonProgress;
  }

  async remove(id: string): Promise<void> {
    const lessonProgress = await this.findOne(id);
    await lessonProgress.destroy();
  }

  // Statistics methods for section progress
  async getSectionProgressStats(): Promise<{
    reading: { completed: number; total: number; percentage: number };
    listening: { completed: number; total: number; percentage: number };
    grammar: { completed: number; total: number; percentage: number };
    writing: { completed: number; total: number; percentage: number };
    speaking: { completed: number; total: number; percentage: number };
  }> {
    const allProgress = await this.lessonProgressModel.findAll();
    const totalRecords = allProgress.length;

    if (totalRecords === 0) {
      const emptyStats = { completed: 0, total: 0, percentage: 0 };
      return {
        reading: emptyStats,
        listening: emptyStats,
        grammar: emptyStats,
        writing: emptyStats,
        speaking: emptyStats,
      };
    }

    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    const stats: any = {};

    for (const section of sections) {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      const completed = allProgress.filter(p => p[sectionField] === true).length;
      const percentage = Math.round((completed / totalRecords) * 100 * 100) / 100;

      stats[section] = {
        completed,
        total: totalRecords,
        percentage,
      };
    }

    return stats;
  }

  async getStudentSectionProgressStats(studentId: string): Promise<{
    reading: { completed: number; total: number; percentage: number };
    listening: { completed: number; total: number; percentage: number };
    grammar: { completed: number; total: number; percentage: number };
    writing: { completed: number; total: number; percentage: number };
    speaking: { completed: number; total: number; percentage: number };
  }> {
    const studentProgress = await this.findByStudentId(studentId);
    const totalRecords = studentProgress.length;

    if (totalRecords === 0) {
      const emptyStats = { completed: 0, total: 0, percentage: 0 };
      return {
        reading: emptyStats,
        listening: emptyStats,
        grammar: emptyStats,
        writing: emptyStats,
        speaking: emptyStats,
      };
    }

    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    const stats: any = {};

    for (const section of sections) {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      const completed = studentProgress.filter(p => p[sectionField] === true).length;
      const percentage = Math.round((completed / totalRecords) * 100 * 100) / 100;

      stats[section] = {
        completed,
        total: totalRecords,
        percentage,
      };
    }

    return stats;
  }

  async getLessonSectionProgressStats(lessonId: string): Promise<{
    reading: { completed: number; total: number; percentage: number };
    listening: { completed: number; total: number; percentage: number };
    grammar: { completed: number; total: number; percentage: number };
    writing: { completed: number; total: number; percentage: number };
    speaking: { completed: number; total: number; percentage: number };
  }> {
    const lessonProgress = await this.findByLessonId(lessonId);
    const totalRecords = lessonProgress.length;

    if (totalRecords === 0) {
      const emptyStats = { completed: 0, total: 0, percentage: 0 };
      return {
        reading: emptyStats,
        listening: emptyStats,
        grammar: emptyStats,
        writing: emptyStats,
        speaking: emptyStats,
      };
    }

    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    const stats: any = {};

    for (const section of sections) {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      const completed = lessonProgress.filter(p => p[sectionField] === true).length;
      const percentage = Math.round((completed / totalRecords) * 100 * 100) / 100;

      stats[section] = {
        completed,
        total: totalRecords,
        percentage,
      };
    }

    return stats;
  }

  async getAverageSectionProgress(): Promise<{
    reading: number;
    listening: number;
    grammar: number;
    writing: number;
    speaking: number;
    overall: number;
  }> {
    const allProgress = await this.lessonProgressModel.findAll();
    
    if (allProgress.length === 0) {
      return {
        reading: 0,
        listening: 0,
        grammar: 0,
        writing: 0,
        speaking: 0,
        overall: 0,
      };
    }

    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    const averages: any = {};
    let totalAverage = 0;

    for (const section of sections) {
      const sectionField = `${section}_completed` as keyof LessonProgress;
      const completed = allProgress.filter(p => p[sectionField] === true).length;
      const average = Math.round((completed / allProgress.length) * 100 * 100) / 100;
      averages[section] = average;
      totalAverage += average;
    }

    averages.overall = Math.round((totalAverage / sections.length) * 100) / 100;

    return averages;
  }

  async getTopPerformingStudentsBySection(section: string, limit: number = 10): Promise<{
    section: string;
    students: Array<{
      student_id: string;
      completed_lessons: number;
      total_lessons: number;
      completion_rate: number;
    }>;
  }> {
    if (!['reading', 'listening', 'grammar', 'writing', 'speaking'].includes(section)) {
      throw new Error('Invalid section. Must be one of: reading, listening, grammar, writing, speaking');
    }

    const allProgress = await this.lessonProgressModel.findAll();
    const studentStats = new Map<string, { completed: number; total: number }>();

    // Group by student and calculate stats
    for (const progress of allProgress) {
      const studentId = progress.student_id;
      const sectionField = `${section}_completed` as keyof LessonProgress;
      
      if (!studentStats.has(studentId)) {
        studentStats.set(studentId, { completed: 0, total: 0 });
      }

      const stats = studentStats.get(studentId)!;
      stats.total++;
      if (progress[sectionField]) {
        stats.completed++;
      }
    }

    // Convert to array and calculate completion rates
    const studentsWithRates = Array.from(studentStats.entries())
      .map(([student_id, stats]) => ({
        student_id,
        completed_lessons: stats.completed,
        total_lessons: stats.total,
        completion_rate: Math.round((stats.completed / stats.total) * 100 * 100) / 100,
      }))
      .sort((a, b) => b.completion_rate - a.completion_rate)
      .slice(0, limit);

    return {
      section,
      students: studentsWithRates,
    };
  }

  async getComprehensiveProgressReport(): Promise<{
    overall_stats: {
      total_students: number;
      total_lessons: number;
      average_completion_rate: number;
    };
    section_averages: {
      reading: number;
      listening: number;
      grammar: number;
      writing: number;
      speaking: number;
    };
    completion_distribution: {
      completed_0_20: number;
      completed_21_40: number;
      completed_41_60: number;
      completed_61_80: number;
      completed_81_100: number;
    };
    top_performers: {
      reading: Array<{ student_id: string; completion_rate: number }>;
      listening: Array<{ student_id: string; completion_rate: number }>;
      grammar: Array<{ student_id: string; completion_rate: number }>;
      writing: Array<{ student_id: string; completion_rate: number }>;
      speaking: Array<{ student_id: string; completion_rate: number }>;
    };
  }> {
    const allProgress = await this.lessonProgressModel.findAll();
    const uniqueStudents = new Set(allProgress.map(p => p.student_id)).size;
    const uniqueLessons = new Set(allProgress.map(p => p.lesson_id)).size;

    // Calculate overall completion rate
    const totalProgressPercentage = allProgress.reduce((sum, p) => sum + Number(p.progress_percentage), 0);
    const averageCompletionRate = allProgress.length > 0 
      ? Math.round((totalProgressPercentage / allProgress.length) * 100) / 100 
      : 0;

    // Section averages
    const sectionAverages = await this.getAverageSectionProgress();

    // Completion distribution
    const distribution = {
      completed_0_20: 0,
      completed_21_40: 0,
      completed_41_60: 0,
      completed_61_80: 0,
      completed_81_100: 0,
    };

    for (const progress of allProgress) {
      const percentage = Number(progress.progress_percentage);
      if (percentage <= 20) distribution.completed_0_20++;
      else if (percentage <= 40) distribution.completed_21_40++;
      else if (percentage <= 60) distribution.completed_41_60++;
      else if (percentage <= 80) distribution.completed_61_80++;
      else distribution.completed_81_100++;
    }

    // Top performers by section
    const topPerformers: any = {};
    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    
    for (const section of sections) {
      const sectionTopPerformers = await this.getTopPerformingStudentsBySection(section, 5);
      topPerformers[section] = sectionTopPerformers.students.map(s => ({
        student_id: s.student_id,
        completion_rate: s.completion_rate,
      }));
    }

    return {
      overall_stats: {
        total_students: uniqueStudents,
        total_lessons: uniqueLessons,
        average_completion_rate: averageCompletionRate,
      },
      section_averages: {
        reading: sectionAverages.reading,
        listening: sectionAverages.listening,
        grammar: sectionAverages.grammar,
        writing: sectionAverages.writing,
        speaking: sectionAverages.speaking,
      },
      completion_distribution: distribution,
      top_performers: topPerformers,
    };
  }

  async getStudentComparisonStats(studentIds: string[]): Promise<{
    students: Array<{
      student_id: string;
      reading_progress: number;
      listening_progress: number;
      grammar_progress: number;
      writing_progress: number;
      speaking_progress: number;
      overall_progress: number;
      completed_lessons: number;
      total_lessons: number;
    }>;
    group_averages: {
      reading: number;
      listening: number;
      grammar: number;
      writing: number;
      speaking: number;
      overall: number;
    };
  }> {
    const students = [];
    const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
    let groupTotals = { reading: 0, listening: 0, grammar: 0, writing: 0, speaking: 0, overall: 0 };

    for (const studentId of studentIds) {
      const studentProgress = await this.findByStudentId(studentId);
      const completedLessons = studentProgress.filter(p => p.completed).length;
      const totalLessons = studentProgress.length;

      const studentStats: any = {
        student_id: studentId,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
      };

      let totalSectionProgress = 0;

      for (const section of sections) {
        const sectionField = `${section}_completed` as keyof LessonProgress;
        const sectionCompleted = studentProgress.filter(p => p[sectionField] === true).length;
        const sectionProgress = totalLessons > 0 ? Math.round((sectionCompleted / totalLessons) * 100 * 100) / 100 : 0;
        
        studentStats[`${section}_progress`] = sectionProgress;
        groupTotals[section as keyof typeof groupTotals] += sectionProgress;
        totalSectionProgress += sectionProgress;
      }

      const overallProgress = Math.round((totalSectionProgress / sections.length) * 100) / 100;
      studentStats.overall_progress = overallProgress;
      groupTotals.overall += overallProgress;

      students.push(studentStats);
    }

    // Calculate group averages
    const studentCount = studentIds.length || 1;
    const groupAverages = {
      reading: Math.round((groupTotals.reading / studentCount) * 100) / 100,
      listening: Math.round((groupTotals.listening / studentCount) * 100) / 100,
      grammar: Math.round((groupTotals.grammar / studentCount) * 100) / 100,
      writing: Math.round((groupTotals.writing / studentCount) * 100) / 100,
      speaking: Math.round((groupTotals.speaking / studentCount) * 100) / 100,
      overall: Math.round((groupTotals.overall / studentCount) * 100) / 100,
    };

    return {
      students,
      group_averages: groupAverages,
    };
  }

  async getProgressTrends(days: number = 30): Promise<{
    daily_progress: Array<{
      date: string;
      new_completions: number;
      cumulative_completions: number;
      average_daily_progress: number;
    }>;
    section_trends: {
      reading: Array<{ date: string; completions: number }>;
      listening: Array<{ date: string; completions: number }>;
      grammar: Array<{ date: string; completions: number }>;
      writing: Array<{ date: string; completions: number }>;
      speaking: Array<{ date: string; completions: number }>;
    };
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const allProgress = await this.lessonProgressModel.findAll({
      where: {
        updatedAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      order: [['updatedAt', 'ASC']],
    });

    const dailyProgress: Map<string, { completions: number; total: number }> = new Map();
    const sectionTrends: any = {
      reading: new Map(),
      listening: new Map(),
      grammar: new Map(),
      writing: new Map(),
      speaking: new Map(),
    };

    // Initialize maps for each day
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      dailyProgress.set(dateStr, { completions: 0, total: 0 });
      Object.keys(sectionTrends).forEach(section => {
        sectionTrends[section].set(dateStr, 0);
      });
    }

    // Process progress data
    for (const progress of allProgress) {
      const dateStr = progress.updatedAt.toISOString().split('T')[0];
      
      if (dailyProgress.has(dateStr)) {
        const dayData = dailyProgress.get(dateStr)!;
        dayData.total++;
        if (progress.completed) {
          dayData.completions++;
        }

        // Track section completions
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        for (const section of sections) {
          const sectionField = `${section}_completed` as keyof LessonProgress;
          if (progress[sectionField]) {
            const currentCount = sectionTrends[section].get(dateStr) || 0;
            sectionTrends[section].set(dateStr, currentCount + 1);
          }
        }
      }
    }

    // Convert to arrays and calculate cumulative
    let cumulativeCompletions = 0;
    const dailyProgressArray = Array.from(dailyProgress.entries()).map(([date, data]) => {
      cumulativeCompletions += data.completions;
      const averageProgress = data.total > 0 ? Math.round((data.completions / data.total) * 100 * 100) / 100 : 0;
      
      return {
        date,
        new_completions: data.completions,
        cumulative_completions: cumulativeCompletions,
        average_daily_progress: averageProgress,
      };
    });

    const sectionTrendsArray: any = {};
    Object.keys(sectionTrends).forEach(section => {
      sectionTrendsArray[section] = Array.from(sectionTrends[section].entries()).map(([date, completions]) => ({
        date,
        completions,
      }));
    });

    return {
      daily_progress: dailyProgressArray,
      section_trends: sectionTrendsArray,
    };
  }
}
  
