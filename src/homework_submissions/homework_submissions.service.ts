import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSection } from "./entities/homework_sections.entity.js";
import { CreateHomeworkSubmissionDto } from "./dto/create-homework-submission.dto.js";
import { UpdateHomeworkSubmissionDto } from "./dto/update-homework-submission.dto.js";
import { UpdateHomeworkSectionDto } from "./dto/update-homework-section.dto.js";
import { LessonProgressService } from "../lesson_progress/lesson_progress.service.js";
import { SpeakingResponse } from "../speaking-response/entities/speaking-response.entity.js";
import { GroupStudentsService } from "../group-students/group-students.service.js";
import { OpenaiService } from "../services/openai/openai.service.js";

@Injectable()
export class HomeworkSubmissionsService {
  constructor(
    @InjectModel(HomeworkSubmission)
    private homeworkSubmissionModel: typeof HomeworkSubmission,
    @InjectModel(HomeworkSection)
    private homeworkSectionModel: typeof HomeworkSection,
    @InjectModel(SpeakingResponse)
    private speakingResponseModel: typeof SpeakingResponse,
    private lessonProgressService: LessonProgressService,
    private groupStudentsService: GroupStudentsService,
    private openaiService: OpenaiService
  ) {}

  async create(
    createHomeworkSubmissionDto: CreateHomeworkSubmissionDto
  ): Promise<{
    submission: HomeworkSubmission;
    section: HomeworkSection;
  }> {
    // Create the main homework submission
    const submission = await this.homeworkSubmissionModel.create({
      homework_id: createHomeworkSubmissionDto.homework_id,
      student_id: createHomeworkSubmissionDto.student_id,
      lesson_id: createHomeworkSubmissionDto.lesson_id,
    });

    // Create the homework section with answers and score
    const section = await this.homeworkSectionModel.create({
      submission_id: submission.id,
      exercise_id: createHomeworkSubmissionDto.exercise_id,
      speaking_id: createHomeworkSubmissionDto.speaking_id,
      score: createHomeworkSubmissionDto.percentage,
      section: createHomeworkSubmissionDto.section,
      answers: createHomeworkSubmissionDto.answers || {},
    });

    return { submission, section };
  }

  async findAll(): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionModel.findAll({
      include: [
        {
          model: this.homeworkSectionModel,
          as: "sections",
        },
      ],
    });
  }

  async findOne(id: string): Promise<HomeworkSubmission> {
    const submission = await this.homeworkSubmissionModel.findOne({
      where: { id },
    });
    if (!submission) {
      throw new NotFoundException(
        `Homework submission with ID ${id} not found`
      );
    }
    return submission;
  }

  async findByHomeworkId(homeworkId: string): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionModel.findAll({
      where: { homework_id: homeworkId },
      include: [
        {
          model: this.homeworkSectionModel,
          as: "sections",
          attributes: [
            "id",
            "exercise_id",
            "speaking_id",
            "score",
            "section",
            "answers",
            "createdAt",
            "updatedAt",
          ],
        },
        {
          model: this.homeworkSubmissionModel.sequelize.models.User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
            "phone",
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [
          { model: this.homeworkSectionModel, as: "sections" },
          "createdAt",
          "ASC",
        ],
      ],
    });
  }

  async findByStudentId(studentId: string): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionModel.findAll({
      where: { student_id: studentId },
    });
  }

  async findByStudentAndHomework(
    studentId: string,
    homeworkId: string
  ): Promise<HomeworkSubmission> {
    const submission = await this.homeworkSubmissionModel.findOne({
      where: {
        student_id: studentId,
        homework_id: homeworkId,
      },
    });
    if (!submission) {
      throw new NotFoundException(
        `Homework submission not found for student ${studentId} and homework ${homeworkId}`
      );
    }
    return submission;
  }

  async update(
    id: string,
    updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto
  ): Promise<HomeworkSubmission> {
    const submission = await this.findOne(id);
    await submission.update(updateHomeworkSubmissionDto);
    return submission;
  }

  async updateFeedback(
    id: string,
    feedback: string
  ): Promise<HomeworkSubmission> {
    const submission = await this.findOne(id);
    await submission.update({ feedback });
    return submission;
  }

  async updateStatus(id: string, status: string): Promise<HomeworkSubmission> {
    const submission = await this.findOne(id);

    // Find all sections for this submission
    const sections = await this.homeworkSectionModel.findAll({
      where: { submission_id: submission.id },
    });

    // Update lesson progress if submission is passed
    if (
      status === "passed" &&
      submission.student_id &&
      submission.homework_id
    ) {
      for (const section of sections) {
        try {
          await this.lessonProgressService.updateProgressFromHomeworkSubmission(
            submission.student_id,
            submission.homework_id,
            section.section
          );
        } catch (error) {
          console.warn("Failed to update lesson progress:", error);
          // Don't fail the status update if lesson progress update fails
        }
      }
    }

    return submission;
  }

  async saveBySection(
    createHomeworkSubmissionDto: CreateHomeworkSubmissionDto
  ): Promise<{
    submission: HomeworkSubmission;
    section: HomeworkSection;
  }> {
    // Check if a submission already exists for this student and homework
    let submission = await this.homeworkSubmissionModel.findOne({
      where: {
        student_id: createHomeworkSubmissionDto.student_id,
        homework_id: createHomeworkSubmissionDto.homework_id,
      },
      attributes: [
        "id",
        "homework_id",
        "student_id",
        "lesson_id",
        "createdAt",
        "updatedAt",
      ], // Explicitly specify the columns to select
    });

    if (!submission) {
      // Create new submission
      submission = await this.homeworkSubmissionModel.create({
        homework_id: createHomeworkSubmissionDto.homework_id,
        student_id: createHomeworkSubmissionDto.student_id,
        lesson_id: createHomeworkSubmissionDto.lesson_id,
      });
    }

    // Check if a section already exists for this submission, section type AND exercise_id
    let section = null;

    if (createHomeworkSubmissionDto.exercise_id) {
      // If exercise_id is provided, look for a section with this specific exercise_id
      section = await this.homeworkSectionModel.findOne({
        where: {
          submission_id: submission.id,
          section: createHomeworkSubmissionDto.section,
          exercise_id: createHomeworkSubmissionDto.exercise_id,
        },
      });
    }

    if (section) {
      // Update existing section with the same exercise_id
      await section.update({
        score: createHomeworkSubmissionDto.percentage,
        speaking_id: createHomeworkSubmissionDto.speaking_id,
        answers: createHomeworkSubmissionDto.answers || {},
      });
    } else {
      // Create new section (either because no section exists for this exercise_id or exercise_id is not provided)
      section = await this.homeworkSectionModel.create({
        submission_id: submission.id,
        exercise_id: createHomeworkSubmissionDto.exercise_id,
        speaking_id: createHomeworkSubmissionDto.speaking_id,
        score: createHomeworkSubmissionDto.percentage,
        section: createHomeworkSubmissionDto.section,
        answers: createHomeworkSubmissionDto.answers || {},
      });
    }

    // If this is a writing section, automatically assess it using OpenAI
    if (createHomeworkSubmissionDto.section === "writing") {
      try {
        // Use checkWritingAnswers method to automatically assess the writing
        section = await this.checkWritingAnswers(section.id, "General Writing");
        console.log(
          `Writing section ${section.id} automatically assessed with score: ${section.score}`
        );
      } catch (error) {
        console.warn("Failed to automatically assess writing section:", error);
        // Continue with the original flow even if assessment fails
      }
    }

    // Only proceed if we have a passing score, a student ID, lesson ID and homework ID
    if (
      section.score &&
      section.score >= 60 &&
      submission.student_id &&
      submission.lesson_id &&
      submission.homework_id
    ) {
      try {
        // Step 1: Update the specific section progress first
        await this.lessonProgressService.updateProgressFromHomeworkSubmission(
          submission.student_id,
          submission.homework_id,
          section.section
        );

        // Step 2: Check if all sections for this lesson have been completed
        await this.checkAndUpdateAllSectionsCompleted(submission);
      } catch (error) {
        console.warn("Failed to update lesson progress:", error);
        // Don't fail the homework submission if lesson progress update fails
      }
    }

    return { submission, section };
  }

  /**
   * Check if all required exercises and speaking sections for a lesson have been submitted
   * and update the lesson progress accordingly
   */
  private async checkAndUpdateAllSectionsCompleted(
    submission: HomeworkSubmission
  ): Promise<void> {
    if (!submission.lesson_id || !submission.student_id) {
      return;
    }

    try {
      // First get all submissions for this student and lesson
      const submissions = await this.homeworkSubmissionModel.findAll({
        where: {
          student_id: submission.student_id,
          lesson_id: submission.lesson_id,
        },
        attributes: ["id", "student_id", "lesson_id", "homework_id"],
      });

      // Get all submission IDs
      const submissionIds = submissions.map((sub) => sub.id);

      // Now get sections for these submissions
      const sections = await this.homeworkSectionModel.findAll({
        where: {
          submission_id: { [Op.in]: submissionIds },
          score: { [Op.gte]: 60 }, // Only count sections with passing scores
        },
      });

      // Group completed sections by type
      const completedSectionTypes = new Set(sections.map((s) => s.section));

      // Get the current lesson progress
      const progress = await this.lessonProgressService.findByStudentAndLesson(
        submission.student_id,
        submission.lesson_id
      );

      if (!progress) {
        return;
      }

      // Update each section based on submissions
      const sectionTypes = [
        "reading",
        "listening",
        "grammar",
        "writing",
        "speaking",
      ];
      const updateData: any = {};

      for (const section of sectionTypes) {
        if (completedSectionTypes.has(section)) {
          const sectionField =
            `${section}_completed` as keyof typeof updateData;
          updateData[sectionField] = true;
        }
      }

      // Update the progress with all completed sections
      await progress.update(updateData);

      // Recalculate the overall progress
      await this.lessonProgressService.recalculateProgress(progress);

      console.log(
        `Updated lesson progress for student ${submission.student_id}, lesson ${submission.lesson_id}`
      );
    } catch (error) {
      console.error("Error checking all sections completed:", error);
    }
  }

  async findBySection(section: string): Promise<HomeworkSection[]> {
    return await this.homeworkSectionModel.findAll({
      where: { section },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: this.homeworkSubmissionModel,
          as: "submission",
        },
      ],
    });
  }

  async findByStudentAndSection(
    studentId: string,
    section: string
  ): Promise<HomeworkSection[]> {
    return await this.homeworkSectionModel.findAll({
      where: { section },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: this.homeworkSubmissionModel,
          as: "submission",
          where: { student_id: studentId },
        },
      ],
    });
  }

  async findByHomeworkAndSection(
    homeworkId: string,
    section: string
  ): Promise<HomeworkSection[]> {
    return await this.homeworkSectionModel.findAll({
      where: { section },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: this.homeworkSubmissionModel,
          as: "submission",
          where: { homework_id: homeworkId },
        },
      ],
    });
  }

  async findByStudentHomeworkAndSection(
    studentId: string,
    homeworkId: string,
    section: string
  ): Promise<HomeworkSection> {
    const homeworkSection = await this.homeworkSectionModel.findOne({
      where: { section },
      include: [
        {
          model: this.homeworkSubmissionModel,
          as: "submission",
          where: {
            student_id: studentId,
            homework_id: homeworkId,
          },
        },
      ],
    });

    if (!homeworkSection) {
      throw new NotFoundException(
        `Homework section not found for student ${studentId}, homework ${homeworkId}, and section ${section}`
      );
    }

    return homeworkSection;
  }

  async remove(id: string): Promise<void> {
    const submission = await this.findOne(id);
    await submission.destroy();
  }

  /**
   * Update a homework section by ID. If the updated score is passing (>=60),
   * update lesson progress for the related student/homework/section and then
   * re-evaluate all sections completed for the submission.
   *
   * @param sectionId The homework section ID
   * @param updateData DTO containing the data to update (score?, answers?, speaking_id?)
   */
  async updateSection(
    sectionId: string,
    updateData: UpdateHomeworkSectionDto
  ): Promise<HomeworkSection> {
    // Find the section
    const section = await this.homeworkSectionModel.findOne({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException(
        `Homework section with ID ${sectionId} not found`
      );
    }

    // Update the section fields
    await section.update({
      ...(updateData.exercise_id !== undefined
        ? { exercise_id: updateData.exercise_id }
        : {}),
      ...(updateData.speaking_id !== undefined
        ? { speaking_id: updateData.speaking_id }
        : {}),
      ...(updateData.score !== undefined ? { score: updateData.score } : {}),
      ...(updateData.section !== undefined
        ? { section: updateData.section }
        : {}),
      ...(updateData.answers !== undefined
        ? { answers: updateData.answers }
        : {}),
    });

    // Load the parent submission to access student_id and homework_id
    const submission = await this.homeworkSubmissionModel.findOne({
      where: { id: section.submission_id },
    });

    // If section has a passing score, update lesson progress for that section
    try {
      if (
        section.score !== null &&
        section.score !== undefined &&
        section.score >= 60 &&
        submission &&
        submission.student_id &&
        submission.homework_id
      ) {
        await this.lessonProgressService.updateProgressFromHomeworkSubmission(
          submission.student_id,
          submission.homework_id,
          section.section
        );
      }
    } catch (error) {
      console.warn(
        "Failed to update lesson progress after section update:",
        error
      );
    }

    // Re-check all sections for this submission and update lesson progress flags if necessary
    if (submission) {
      try {
        await this.checkAndUpdateAllSectionsCompleted(submission);
      } catch (error) {
        console.warn("Failed to re-evaluate sections after update:", error);
      }
    }

    return section;
  }

  /**
   * Get exercises with their scores from homework sections by student_id and homework_id
   * @param studentId The student's ID
   * @param homeworkId The homework's ID
   * @param section Optional section type to filter by (reading, listening, grammar, writing, speaking)
   * @returns Array of exercises with scores and completion status
   */
  async getExercisesWithScoresByStudentAndHomework(
    studentId: string,
    homeworkId: string,
    section?: string
  ): Promise<any[]> {
    // Find the submission for this student and homework
    const submission = await this.homeworkSubmissionModel.findOne({
      where: {
        student_id: studentId,
        homework_id: homeworkId,
      },
      attributes: ["id"],
    });

    if (!submission) {
      return []; // Return empty array if no submission exists
    }

    // Prepare where clause for sections
    const whereClause: any = {
      submission_id: submission.id,
    };

    // Add section filter if provided
    if (section) {
      whereClause.section = section;
    }

    // Get all sections with their associated exercises
    const sections = await this.homeworkSectionModel.findAll({
      where: whereClause,
      include: [
        {
          model: this.homeworkSubmissionModel.sequelize.models.Exercise,
          as: "exercise",
          attributes: ["id", "title", "exercise_type", "lesson_id"],
        },
      ],
      attributes: ["id", "exercise_id", "score", "section", "answers"],
    });

    // Transform the data to include the completed status
    return sections.map((section) => {
      const data = section.toJSON();

      // Add a completed status based on the score
      const isCompleted = section.score >= 60;

      return {
        ...data,
        completed: isCompleted,
        exercise: data.exercise
          ? {
              ...data.exercise,
              completed: isCompleted, // Adding completion status to exercise object too
              score: section.score,
            }
          : null,
      };
    });
  }

  /**
   * Get student's homework statistics average by section type for all time
   * @param studentId The student's ID
   * @returns Object with section types as keys and average scores as values
   */
  async getStudentHomeworkStatsBySection(
    studentId: string
  ): Promise<{
    overall: number;
    sections: {
      [key: string]: {
        average: number;
        submissions: number;
        trend: number[];
      };
    };
  }> {
    // Find all submissions for this student
    const submissions = await this.homeworkSubmissionModel.findAll({
      where: {
        student_id: studentId,
      },
      attributes: ["id"],
      order: [["createdAt", "ASC"]],
    });

    // Get speaking responses for this student
    const speakingResponses = await this.speakingResponseModel.findAll({
      where: {
        student_id: studentId,
        pronunciation_score: {
          [Op.not]: null,
        },
      },
      attributes: ["pronunciation_score", "created_at"],
    });

    if (
      (!submissions || submissions.length === 0) &&
      speakingResponses.length === 0
    ) {
      return {
        overall: 0,
        sections: {},
      };
    }

    const submissionIds = submissions.map((sub) => sub.id);

    // Get all sections for these submissions
    let sections = [];
    if (submissionIds.length > 0) {
      sections = await this.homeworkSectionModel.findAll({
        where: {
          submission_id: { [Op.in]: submissionIds },
        },
        order: [["createdAt", "ASC"]],
        attributes: ["section", "score", "createdAt"],
      });
    }

    // Initialize the result structure with section types
    const sectionTypes = [
      "reading",
      "listening",
      "grammar",
      "writing",
      "speaking",
    ];
    const result: {
      overall: number;
      sections: {
        [key: string]: {
          average: number;
          submissions: number;
          trend: number[];
        };
      };
    } = {
      overall: 0,
      sections: {},
    };

    sectionTypes.forEach((sectionType) => {
      result.sections[sectionType] = {
        average: 0,
        submissions: 0,
        trend: [],
      };
    });

    // Process homework sections (including speaking sections from homework submissions)
    let totalScore = 0;
    let totalSubmissions = 0;

    sections.forEach((section) => {
      if (
        section.section &&
        sectionTypes.includes(section.section)
      ) {
        // Only include valid sections and scores
        if (section.score !== null && section.score !== undefined) {
          // Add to specific section stats
          result.sections[section.section].submissions += 1;
          result.sections[section.section].average += section.score;
          result.sections[section.section].trend.push(section.score);

          // Add to overall stats
          totalScore += section.score;
          totalSubmissions += 1;
        }
      }
    });

    // Process speaking responses and add them to the speaking section
    // Only include speaking responses if there are no speaking sections from homework submissions
    speakingResponses.forEach((response) => {
      const score = response.pronunciation_score;
      if (score !== null && score !== undefined) {
        // Add to speaking section stats
        result.sections.speaking.submissions += 1;
        result.sections.speaking.average += score;
        result.sections.speaking.trend.push(score);

        // Add to overall stats
        totalScore += score;
        totalSubmissions += 1;
      }
    });

    // Calculate the averages
    if (totalSubmissions > 0) {
      result.overall = parseFloat((totalScore / totalSubmissions).toFixed(2));

      // Calculate averages for each section
      sectionTypes.forEach((sectionType) => {
        if (result.sections[sectionType].submissions > 0) {
          result.sections[sectionType].average = parseFloat(
            (
              result.sections[sectionType].average /
              result.sections[sectionType].submissions
            ).toFixed(2)
          );
        }
      });
    }

    return result;
  }

  /**
   * Get homework sections by speaking_id with their answers and score
   * @param speakingId The speaking exercise ID
   * @param studentId Optional student ID to filter submissions by student
   * @returns Array of homework sections with answers related to the speaking exercise
   */
  async getHomeworkSectionsBySpeakingId(
    speakingId: string,
    studentId?: string
  ): Promise<any[]> {
    // Prepare query conditions
    const whereClause: any = {
      speaking_id: speakingId,
    };

    const includeOptions: any = [
      {
        model: this.homeworkSubmissionModel,
        as: "submission",
        attributes: [
          "id",
          "student_id",
          "homework_id",
          "lesson_id",
          "createdAt",
        ],
      },
    ];

    // Add student filter if provided
    if (studentId) {
      includeOptions[0].where = { student_id: studentId };
    }

    // Get all sections for this speaking exercise
    const sections = await this.homeworkSectionModel.findAll({
      where: whereClause,
      include: includeOptions,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "score",
        "section",
        "answers",
        "speaking_id",
        "createdAt",
        "updatedAt",
      ],
    });

    // Transform the data to include completion status
    return sections.map((section) => {
      const data = section.toJSON();

      // Add a completed status based on the score
      const isCompleted = section.score >= 60;

      return {
        ...data,
        completed: isCompleted,
      };
    });
  }

  /**
   * Get student's average speaking score across all speaking tasks
   * @param studentId The student's ID
   * @returns The average speaking score or 0 if no speaking responses exist
   */
  async getStudentAverageSpeakingScore(studentId: string): Promise<number> {
    // Find all speaking responses for this student
    const speakingResponses = await this.speakingResponseModel.findAll({
      where: {
        student_id: studentId,
        pronunciation_score: {
          [Op.not]: null,
        },
      },
      attributes: ["pronunciation_score"],
    });

    // If no speaking responses with scores exist, return 0
    if (speakingResponses.length === 0) {
      return 0;
    }

    // Calculate the average score
    const totalScore = speakingResponses.reduce((sum, response) => {
      return sum + (response.pronunciation_score || 0);
    }, 0);

    // Return the average rounded to 2 decimal places
    return parseFloat((totalScore / speakingResponses.length).toFixed(2));
  }
  /**
   * Check writing answers from homework sections using OpenAI writing checker bot
   * @param sectionId The homework section ID containing writing answers
   * @param taskType Optional task type for better assessment context
   * @returns Updated homework section with AI assessment and score
   */
  async checkWritingAnswers(
    sectionId: string,
    taskType?: string
  ): Promise<HomeworkSection> {
    // Find the homework section
    const section = await this.homeworkSectionModel.findOne({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException(
        `Homework section with ID ${sectionId} not found`
      );
    }

    // Check if this is a writing section
    if (section.section !== "writing") {
      throw new Error(
        `This method can only be used for writing sections. Current section type: ${section.section}`
      );
    }

    // Extract writing text from answers
    const answers = section.answers as any;
    if (!answers || !answers.writing) {
      throw new Error(
        "No writing content found in the answers. Expected format: {writing: 'student writing text'}"
      );
    }

    const writingText = answers.writing;

    try {
      // Use OpenAI service to assess the writing
      const assessment = await this.openaiService.assessWriting(
        writingText,
        taskType
      );

      // Update the answers JSON to include the assessment
      const updatedAnswers = {
        ...answers,
        assessment: {
          ...assessment,
          assessedAt: new Date().toISOString(),
          taskType: taskType || "General Writing",
        },
      };

      // Update the section with the new score and answers
      await section.update({
        score: assessment.score,
        answers: updatedAnswers,
      });

      // Load the parent submission to potentially update lesson progress
      const submission = await this.homeworkSubmissionModel.findOne({
        where: { id: section.submission_id },
      });

      // If the score is passing (>=20), update lesson progress
      if (
        assessment.score >= 20 &&
        submission &&
        submission.student_id &&
        submission.homework_id
      ) {
        try {
          await this.lessonProgressService.updateProgressFromHomeworkSubmission(
            submission.student_id,
            submission.homework_id,
            section.section
          );

          // Re-check all sections for this submission
          await this.checkAndUpdateAllSectionsCompleted(submission);
        } catch (error) {
          console.warn("Failed to update lesson progress:", error);
        }
      }

      return section;
    } catch (error) {
      console.error("Error assessing writing with OpenAI:", error);
      throw new Error(
        `Failed to assess writing: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Bulk check writing answers for multiple homework sections
   * @param sectionIds Array of homework section IDs
   * @param taskType Optional task type for better assessment context
   * @returns Array of results with success/failure status for each section
   */
  async bulkCheckWritingAnswers(
    sectionIds: string[],
    taskType?: string
  ): Promise<
    Array<{
      sectionId: string;
      success: boolean;
      section?: HomeworkSection;
      error?: string;
    }>
  > {
    const results = [];

    for (const sectionId of sectionIds) {
      try {
        const section = await this.checkWritingAnswers(sectionId, taskType);
        results.push({
          sectionId,
          success: true,
          section,
        });
      } catch (error) {
        results.push({
          sectionId,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Fetch homework submissions for all (active) students in a group
   * @param groupId The group ID
   */
  async findHomeworksByGroupId(groupId: string): Promise<HomeworkSubmission[]> {
    // Get active students in the group using GroupStudentsService
    const groupStudents =
      await this.groupStudentsService.findActiveByGroupId(groupId);

    if (!groupStudents || groupStudents.length === 0) {
      return [];
    }

    const studentIds = groupStudents.map((gs) => gs.student_id);

    // Find submissions for these students and include sections and basic student info
    const submissions = await this.homeworkSubmissionModel.findAll({
      where: {
        student_id: studentIds,
      },
      include: [
        {
          model: this.homeworkSectionModel,
          as: "sections",
        },
        {
          model: this.homeworkSubmissionModel.sequelize.models.User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return submissions;
  }
}
