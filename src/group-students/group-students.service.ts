import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateGroupStudentDto } from "./dto/create-group-student.dto.js";
import { UpdateGroupStudentDto } from "./dto/update-group-student.dto.js";
import { GroupStudent } from "./entities/group-student.entity.js";
import {
  GroupEnrollmentEvent,
  EnrollmentEventType,
} from "./entities/group-enrollment-event.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { User } from "../users/entities/user.entity.js";
import { UserCourseService } from "../user-course/user-course.service.js";

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(GroupEnrollmentEvent)
    private enrollmentEventModel: typeof GroupEnrollmentEvent,
    private userCourseService: UserCourseService,
  ) {}

  /**
   * Auto-enroll the student in the course tied to the group's level, so joining
   * a group automatically gives the student its course. Best-effort: never
   * breaks the enrollment operation itself.
   */
  private async enrollInGroupCourse(
    groupId: string,
    studentId: string,
  ): Promise<void> {
    try {
      const group = await this.groupModel.findByPk(groupId, {
        attributes: ["id", "level_id"],
      });
      await this.userCourseService.enrollIfNeeded(studentId, group?.level_id);
    } catch (err) {
      console.error("Failed to auto-enroll student in group course", err);
    }
  }

  /**
   * Append a membership change to the enrollment-event log, snapshotting the
   * group's current teacher and branch so retention stats survive later
   * teacher/branch reassignments. Best-effort: a logging failure must never
   * break the enrollment operation itself.
   */
  private async recordEnrollmentEvent(
    groupId: string,
    studentId: string,
    eventType: EnrollmentEventType,
    occurredAt: Date,
    reason?: string,
  ): Promise<void> {
    try {
      const group = await this.groupModel.findByPk(groupId, {
        attributes: ["id", "teacher_id", "branch_id"],
      });

      await this.enrollmentEventModel.create({
        group_id: groupId,
        student_id: studentId,
        teacher_id: group?.teacher_id ?? null,
        branch_id: group?.branch_id ?? null,
        event_type: eventType,
        reason: reason ?? null,
        occurred_at: occurredAt,
      });
    } catch (err) {
      console.error("Failed to record enrollment event", err);
    }
  }

  /** Statuses that mean the student is no longer participating in the group. */
  private static readonly LEFT_STATUSES = ["removed", "completed"];

  /** Statuses that mean the student is currently participating in the group. */
  private static readonly PARTICIPATING_STATUSES = ["active", "frozen"];

  /**
   * Single choke point for changing a membership's status: it stamps/clears
   * `left_at` and appends the matching enrollment event so the retention log
   * always stays in sync with `group_students`. No-ops when the status is
   * unchanged. Returns whether the status actually moved.
   */
  private async applyStatusChange(
    enrollment: GroupStudent,
    newStatus: string,
    occurredAt: Date = new Date(),
    reason?: string,
  ): Promise<boolean> {
    const previousStatus = String(enrollment.status);
    if (newStatus === previousStatus) return false;

    const isLeaving = GroupStudentsService.LEFT_STATUSES.includes(newStatus);
    const wasLeft = GroupStudentsService.LEFT_STATUSES.includes(previousStatus);

    await enrollment.update({
      status: newStatus,
      // Stamp left_at when transitioning into a terminal status; clear it if the
      // student is re-activated from a terminal status.
      ...(isLeaving && !wasLeft ? { left_at: occurredAt } : {}),
      ...(!isLeaving && wasLeft ? { left_at: null } : {}),
    });

    if (isLeaving && !wasLeft) {
      await this.recordEnrollmentEvent(
        enrollment.group_id,
        enrollment.student_id,
        EnrollmentEventType.LEFT,
        occurredAt,
        reason ?? newStatus,
      );
    } else if (!isLeaving && wasLeft) {
      // Re-enrollment after having left.
      await this.recordEnrollmentEvent(
        enrollment.group_id,
        enrollment.student_id,
        EnrollmentEventType.JOINED,
        occurredAt,
        reason ?? newStatus,
      );
    }

    return true;
  }

  async create(createDto: CreateGroupStudentDto): Promise<GroupStudent> {
    // Check if student is already in this specific group
    const existingInSameGroup = await this.groupStudentModel.findOne({
      where: {
        group_id: createDto.group_id,
        student_id: createDto.student_id,
        status: ["active", "frozen"], // Consider both active and frozen as existing
      },
    });

    if (existingInSameGroup) {
      throw new ConflictException(
        `Student is already enrolled in this group with status: ${existingInSameGroup.status}`,
      );
    }

    const created = await this.groupStudentModel.create({
      ...createDto,
    });

    await this.recordEnrollmentEvent(
      created.group_id,
      created.student_id,
      EnrollmentEventType.JOINED,
      created.enrolled_at ?? new Date(),
      String(created.status),
    );

    await this.enrollInGroupCourse(created.group_id, created.student_id);

    return created;
  }

  async findAll(): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: { status: "active" },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string): Promise<GroupStudent> {
    const groupStudent = await this.groupStudentModel.findOne({
      where: { id, status: "active" },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });

    if (!groupStudent) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    return groupStudent;
  }

  /**
   * Like {@link findOne} but does not filter by status, so it can return a
   * membership that has just been moved to a terminal status (removed/completed).
   */
  async findOneAny(id: string): Promise<GroupStudent> {
    const groupStudent = await this.groupStudentModel.findByPk(id, {
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });

    if (!groupStudent) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    return groupStudent;
  }

  async findByGroupId(groupId: string): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: { group_id: groupId, status: "active" },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async findByStudentId(studentId: string): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: { student_id: studentId, status: "active" },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async findActiveByGroupId(groupId: string): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: {
        group_id: groupId,
        status: "active",
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async update(
    id: string,
    updateDto: UpdateGroupStudentDto,
  ): Promise<GroupStudent> {
    const enrollment = await this.groupStudentModel.findByPk(id);
    if (!enrollment) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    const { status, ...rest } = updateDto as any;

    // Route status changes through the single choke point so the retention log
    // and left_at stay consistent; apply any remaining fields directly.
    if (status !== undefined) {
      await this.applyStatusChange(enrollment, String(status));
    }
    if (Object.keys(rest).length > 0) {
      await enrollment.update(rest);
    }

    return await this.findOneAny(id);
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const enrollment = await this.groupStudentModel.findByPk(id);
    if (!enrollment) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    const leftAt = new Date();
    await enrollment.update({ status: "removed", left_at: leftAt });

    await this.recordEnrollmentEvent(
      enrollment.group_id,
      enrollment.student_id,
      EnrollmentEventType.LEFT,
      leftAt,
      "removed",
    );

    return { id, deleted: true };
  }

  async updateStatus(id: string, status: string): Promise<GroupStudent> {
    const enrollment = await this.groupStudentModel.findByPk(id);
    if (!enrollment) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    await this.applyStatusChange(enrollment, status);

    return await this.findOneAny(id);
  }

  /**
   * Mark every active/frozen membership of a student as `removed`, recording a
   * LEFT event for each so retention reflects the departure. Used when a student
   * is deactivated or archived account-wide. Returns the affected group ids.
   */
  async deactivateStudentMemberships(
    studentId: string,
    reason = "removed",
  ): Promise<string[]> {
    const memberships = await this.groupStudentModel.findAll({
      where: {
        student_id: studentId,
        status: GroupStudentsService.PARTICIPATING_STATUSES,
      },
    });

    const now = new Date();
    const affected: string[] = [];
    for (const membership of memberships) {
      await this.applyStatusChange(membership, "removed", now, reason);
      affected.push(membership.group_id);
    }
    return affected;
  }

  /**
   * Restore every `removed` membership of a student back to `active`, recording
   * a JOINED event for each. Used when a deactivated/archived account is
   * re-activated. Returns the affected group ids.
   */
  async reactivateStudentMemberships(studentId: string): Promise<string[]> {
    const memberships = await this.groupStudentModel.findAll({
      where: { student_id: studentId, status: "removed" },
    });

    const now = new Date();
    const affected: string[] = [];
    for (const membership of memberships) {
      await this.applyStatusChange(membership, "active", now, "active");
      affected.push(membership.group_id);
    }
    return affected;
  }

  async transferStudent(
    studentId: string,
    fromGroupId: string,
    toGroupId: string,
  ): Promise<{ removed: GroupStudent; added: GroupStudent }> {
    // Find existing enrollment in the source group
    const existingEnrollment = await this.groupStudentModel.findOne({
      where: {
        student_id: studentId,
        group_id: fromGroupId,
        status: "active",
      },
    });

    if (!existingEnrollment) {
      throw new NotFoundException(
        `Student is not actively enrolled in the source group (ID: ${fromGroupId})`,
      );
    }

    // Check if student is already in the target group
    const existingInTargetGroup = await this.groupStudentModel.findOne({
      where: {
        group_id: toGroupId,
        student_id: studentId,
        status: ["active", "frozen"],
      },
    });

    if (existingInTargetGroup) {
      throw new ConflictException(
        `Student is already enrolled in the target group with status: ${existingInTargetGroup.status}`,
      );
    }

    const now = new Date();

    // Soft-remove from current group (keep the row + history instead of
    // hard-deleting, so retention can account for the transfer out).
    await existingEnrollment.update({ status: "removed", left_at: now });
    await this.recordEnrollmentEvent(
      fromGroupId,
      studentId,
      EnrollmentEventType.TRANSFERRED_OUT,
      now,
      "transfer",
    );

    // Add to new group
    const newEnrollment = await this.groupStudentModel.create({
      group_id: toGroupId,
      student_id: studentId,
      enrolled_at: now,
      status: "active",
    });
    await this.recordEnrollmentEvent(
      toGroupId,
      studentId,
      EnrollmentEventType.TRANSFERRED_IN,
      now,
      "transfer",
    );

    await this.enrollInGroupCourse(toGroupId, studentId);

    return {
      removed: existingEnrollment,
      added: await this.findOne(newEnrollment.id),
    };
  }

  async countStudentsByTeacher(teacherId: string): Promise<number> {
    // First get all groups for this teacher
    const teacherGroups = await this.groupModel.findAll({
      where: { teacher_id: teacherId },
      attributes: ["id"],
    });

    if (teacherGroups.length === 0) {
      return 0;
    }

    // Extract group IDs
    const groupIds = teacherGroups.map((group) => group.id);

    // Count distinct students across all teacher's groups
    const studentCount = await this.groupStudentModel.count({
      where: {
        group_id: groupIds,
        status: "active", // Only count active students
      },
      distinct: true,
      col: "student_id", // Count distinct students (in case a student is in multiple groups)
    });

    return studentCount;
  }

  async getStudentsByTeacher(teacherId: string): Promise<GroupStudent[]> {
    // Get all groups for this teacher
    const teacherGroups = await this.groupModel.findAll({
      where: { teacher_id: teacherId },
      attributes: ["id"],
    });

    if (teacherGroups.length === 0) {
      return [];
    }

    // Extract group IDs
    const groupIds = teacherGroups.map((group) => group.id);

    // Get all group students for this teacher's groups
    return await this.groupStudentModel.findAll({
      where: {
        group_id: groupIds,
        status: "active", // Only active students
      },
      include: [
        {
          model: User,
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
        {
          model: Group,
          as: "group",
          attributes: ["id", "name", "level_id"],
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }
}
