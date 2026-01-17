import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StudentPayment } from "./entities/student-payment.entity.js";
import { User } from "../users/entities/user.entity.js";
import { StudentWallet } from "../student-wallet/entities/student-wallet.entity.js";
import { StudentTransaction } from "../student-transaction/entities/student-transaction.entity.js";
import { PaymentAction } from "../payment-actions/entities/payment-action.entity.js";
import {
  CreateStudentPaymentDto,
  PaymentStatus,
  PaymentMethod,
} from "./dto/create-student-payment.dto.js";
import { UpdateStudentPaymentDto } from "./dto/update-student-payment.dto.js";
import { StudentPaymentStatusDto } from "./dto/student-payment-status.dto.js";
import { Op, fn, col, literal } from "sequelize";
import { SmsService } from "../sms/sms.service.js";

@Injectable()
export class StudentPaymentService {
  private readonly logger = new Logger(StudentPaymentService.name);

  constructor(
    @InjectModel(StudentPayment)
    private studentPaymentModel: typeof StudentPayment,
    @InjectModel(StudentWallet)
    private studentWalletModel: typeof StudentWallet,
    @InjectModel(StudentTransaction)
    private studentTransactionModel: typeof StudentTransaction,
    @InjectModel(User)
    private userModel: typeof User,
    private readonly smsService: SmsService,
  ) {}

  async create(
    createStudentPaymentDto: CreateStudentPaymentDto,
  ): Promise<StudentPayment> {
    // Start a transaction to ensure atomicity
    const transaction = await this.studentPaymentModel.sequelize.transaction();

    try {
      // Create the payment record
      const payment = await this.studentPaymentModel.create(
        { ...createStudentPaymentDto },
        { transaction },
      );

      // Only update wallet and create transaction if payment status is "completed"
      if (payment.status === "completed") {
        // Find or create student wallet
        let wallet = await this.studentWalletModel.findOne({
          where: { student_id: payment.student_id },
          transaction,
        });

        if (!wallet) {
          // Create wallet if it doesn't exist
          wallet = await this.studentWalletModel.create(
            {
              student_id: payment.student_id,
              amount: 0,
            },
            { transaction },
          );
        }

        // Add payment amount to wallet
        const newAmount = wallet.amount + payment.amount;
        await wallet.update({ amount: newAmount }, { transaction });

        // Create a transaction record
        await this.studentTransactionModel.create(
          {
            student_id: payment.student_id,
            amount: payment.amount,
            type: "payment",
          },
          { transaction },
        );

        this.logger.log(
          `Payment completed: Added ${payment.amount} to student ${payment.student_id} wallet. New balance: ${newAmount}`,
        );
      }

      // Commit the transaction
      await transaction.commit();

      // Send SMS notification (non-blocking, error-free)
      if (payment.status === "completed") {
        this.sendPaymentSms(payment).catch((error) => {
          // Log error but don't throw - SMS failure shouldn't fail payment creation
          this.logger.error(
            `Failed to send SMS for payment ${payment.id}:`,
            error,
          );
        });
      }

      return payment;
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      this.logger.error("Error creating payment:", error);
      throw error;
    }
  }

  /**
   * Send payment confirmation SMS to student
   * @param payment - The payment record
   */
  private async sendPaymentSms(payment: StudentPayment): Promise<void> {
    try {
      // Fetch student details
      const student = await this.userModel.findByPk(payment.student_id);

      if (!student) {
        this.logger.warn(
          `Student with ID ${payment.student_id} not found for SMS notification`,
        );
        return;
      }

      if (!student.phone) {
        this.logger.warn(
          `Student ${student.first_name} ${student.last_name} has no phone number`,
        );
        return;
      }

      // Format dates as DD.MM.YYYY
      const formatDate = (date: Date): string => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
      };

      const paymentDate = formatDate(payment.payment_date);
      const nextPaymentDate = formatDate(payment.next_payment_date);

      // Build SMS message
      const message = `Hurmatli, ${student.first_name} ${student.last_name}! Sizning ${paymentDate} dan ${nextPaymentDate} gacha bo'lgan to'lovingiz amalga oshirildi. Impulse Study LC`;

      // Send SMS
      await this.smsService.sendSms({
        mobile_phone: student.phone,
        message: message,
      });

      this.logger.log(
        `Payment SMS sent successfully to ${student.first_name} ${student.last_name} (${student.phone})`,
      );
    } catch (error) {
      // Re-throw to be caught by the caller's catch block
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    query?: string,
    status?: string,
    payment_method?: string,
    startDate?: Date,
    endDate?: Date,
    paymentStartDate?: Date,
    paymentEndDate?: Date,
    nextPaymentStartDate?: Date,
    nextPaymentEndDate?: Date,
  ): Promise<{
    data: StudentPayment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by payment method
    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    // Filter by createdAt date range
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: endDate,
      };
    }

    // Filter by payment_date range
    if (paymentStartDate && paymentEndDate) {
      whereClause.payment_date = {
        [Op.between]: [paymentStartDate, paymentEndDate],
      };
    } else if (paymentStartDate) {
      whereClause.payment_date = {
        [Op.gte]: paymentStartDate,
      };
    } else if (paymentEndDate) {
      whereClause.payment_date = {
        [Op.lte]: paymentEndDate,
      };
    }

    // Filter by next_payment_date range
    if (nextPaymentStartDate && nextPaymentEndDate) {
      whereClause.next_payment_date = {
        [Op.between]: [nextPaymentStartDate, nextPaymentEndDate],
      };
    } else if (nextPaymentStartDate) {
      whereClause.next_payment_date = {
        [Op.gte]: nextPaymentStartDate,
      };
    } else if (nextPaymentEndDate) {
      whereClause.next_payment_date = {
        [Op.lte]: nextPaymentEndDate,
      };
    }

    const { count, rows } = await this.studentPaymentModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "student",
          attributes: { exclude: ["password_hash"] },
          where: query
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${query}%` } },
                  { last_name: { [Op.like]: `%${query}%` } },
                  { username: { [Op.like]: `%${query}%` } },
                  { phone: { [Op.like]: `%${query}%` } },
                ],
              }
            : undefined,
        },
        {
          model: User,
          as: "manager",
          attributes: { exclude: ["password_hash"] },
        },
      ],
      limit,
      offset,
      order: [["payment_date", "DESC"]],
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<StudentPayment> {
    const payment = await this.studentPaymentModel.findByPk(id, {
      include: [
        {
          model: User,
          as: "student",
          attributes: { exclude: ["password_hash"] },
        },
        {
          model: User,
          as: "manager",
          attributes: { exclude: ["password_hash"] },
        },
      ],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return payment;
  }

  async findByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: StudentPayment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = { student_id: studentId };

    // Add search on payment-specific fields if query is provided
    if (query) {
      whereClause[Op.or] = [
        { status: { [Op.like]: `%${query}%` } },
        { payment_method: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.studentPaymentModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "student",
          attributes: { exclude: ["password_hash"] },
        },
        {
          model: User,
          as: "manager",
          attributes: { exclude: ["password_hash"] },
        },
      ],
      limit,
      offset,
      order: [["payment_date", "DESC"]],
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<StudentPayment[]> {
    return this.studentPaymentModel.findAll({
      where: {
        payment_date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: { exclude: ["password_hash"] },
        },
        {
          model: User,
          as: "manager",
          attributes: { exclude: ["password_hash"] },
        },
      ],
    });
  }

  async findByStatus(
    status: PaymentStatus,
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: StudentPayment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await this.studentPaymentModel.findAndCountAll({
      where: { status },
      include: [
        {
          model: User,
          as: "student",
          attributes: { exclude: ["password_hash"] },
          where: query
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${query}%` } },
                  { last_name: { [Op.like]: `%${query}%` } },
                  { username: { [Op.like]: `%${query}%` } },
                  { phone: { [Op.like]: `%${query}%` } },
                ],
              }
            : undefined,
        },
        {
          model: User,
          as: "manager",
          attributes: { exclude: ["password_hash"] },
        },
      ],
      limit,
      offset,
      order: [["payment_date", "DESC"]],
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findUpcomingPayments(days: number = 7): Promise<StudentPayment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    try {
      // Get all students who have payments and are active
      const allPayments = await this.studentPaymentModel.findAll({
        include: [
          {
            model: User,
            as: "student",
            attributes: { exclude: ["password_hash"] },
            where: { is_active: true },
          },
          {
            model: User,
            as: "manager",
            attributes: { exclude: ["password_hash"] },
          },
          {
            model: PaymentAction,
            as: "actions",
            required: false,
          },
        ],
        order: [["next_payment_date", "DESC"]],
      });

      // Group payments by student_id - track both latest completed and any pending
      const studentPaymentsMap = new Map();

      for (const payment of allPayments) {
        if (!studentPaymentsMap.has(payment.student_id)) {
          studentPaymentsMap.set(payment.student_id, {
            latestCompleted: null,
            pending: [],
          });
        }

        const studentPayments = studentPaymentsMap.get(payment.student_id);

        if (payment.status === PaymentStatus.PENDING) {
          studentPayments.pending.push(payment);
        } else if (
          payment.status === PaymentStatus.COMPLETED &&
          !studentPayments.latestCompleted
        ) {
          studentPayments.latestCompleted = payment;
        }
      }

      // Find students with upcoming payments (either pending or upcoming completed)
      const upcomingPayments = [];

      for (const [
        studentId,
        { latestCompleted, pending },
      ] of studentPaymentsMap) {
        // Check pending payments first
        for (const pendingPayment of pending) {
          const nextPaymentDate = new Date(pendingPayment.next_payment_date);
          nextPaymentDate.setHours(0, 0, 0, 0);

          if (nextPaymentDate >= today && nextPaymentDate <= futureDate) {
            upcomingPayments.push(pendingPayment);
            break; // Only add one payment per student
          }
        }

        // If no pending payment was added, check latest completed payment
        if (
          !upcomingPayments.find((p) => p.student_id === studentId) &&
          latestCompleted
        ) {
          const nextPaymentDate = new Date(latestCompleted.next_payment_date);
          nextPaymentDate.setHours(0, 0, 0, 0);

          if (nextPaymentDate >= today && nextPaymentDate <= futureDate) {
            upcomingPayments.push(latestCompleted);
          }
        }
      }

      return upcomingPayments;
    } catch (error) {
      this.logger.error(`Error finding upcoming payments: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    updateStudentPaymentDto: UpdateStudentPaymentDto,
  ): Promise<StudentPayment> {
    const payment = await this.findOne(id);
    await payment.update(updateStudentPaymentDto);
    return payment;
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await payment.destroy();
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<StudentPayment> {
    const payment = await this.findOne(id);
    await payment.update({ status });
    return payment;
  }

  /**
   * Calculate a student's payment status including total paid, pending amounts, and next payment status
   * @param studentId The UUID of the student
   * @returns Payment status information including amounts and upcoming payment details
   */
  async calculateStudentPaymentStatus(
    studentId: string,
  ): Promise<StudentPaymentStatusDto> {
    // Get all payments for this student (fetch all with high limit)
    const paymentsResponse = await this.findByStudent(studentId, 1, 1000);
    const payments = paymentsResponse.data;

    if (!payments.length) {
      return {
        totalPaid: 0,
        pendingAmount: 0,
        paymentStatus: "overdue" as const,
        daysUntilNextPayment: 0,
        nextPaymentDate: null,
      };
    }

    // Set today's date without time for accurate date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate total paid amount (all payments are completed)
    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    // Get the most recent payment (sorted by next_payment_date in descending order)
    const sortedPayments = [...payments].sort(
      (a, b) =>
        new Date(b.next_payment_date).getTime() -
        new Date(a.next_payment_date).getTime(),
    );

    const lastPayment = sortedPayments[0];

    // Check if the last payment's next_payment_date (expiration date) has passed
    const nextPaymentDate = new Date(lastPayment.next_payment_date);
    nextPaymentDate.setHours(0, 0, 0, 0);

    // Determine status based on the last payment's next_payment_date
    let paymentStatus: "on_time" | "overdue" | "upcoming" = "on_time";
    let daysUntilNextPayment: number = 0;
    // Default pending amount is 0
    let pendingAmount = 0;

    if (nextPaymentDate < today) {
      // Last payment has expired, payment is overdue
      paymentStatus = "overdue";
      // Set pending amount to the last payment's amount when overdue
      pendingAmount = Number(lastPayment.amount);
      daysUntilNextPayment =
        Math.floor(
          (today.getTime() - nextPaymentDate.getTime()) / (1000 * 60 * 60 * 24),
        ) * -1; // Negative number of days (overdue)
    } else {
      // Payment is still valid
      paymentStatus = "upcoming";
      daysUntilNextPayment = Math.floor(
        (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      // If payment is due within 3 days, it's still marked as upcoming
    }

    // Add payment count information to help with debugging
    const result = {
      totalPaid,
      pendingAmount,
      paymentStatus,
      daysUntilNextPayment,
      nextPaymentDate,
      // Include counts for troubleshooting
      _debug: {
        totalPayments: payments.length,
        lastPaymentDate: lastPayment.payment_date,
        lastPaymentNextDate: lastPayment.next_payment_date,
        today: today.toISOString().split("T")[0],
        isExpired: nextPaymentDate < today,
      },
    };

    // Remove debug info from production response
    delete result._debug;

    return result;
  }

  /**
   * Cron job that runs every day at midnight to create new payment records
   * for students whose next_payment_date has passed
   */
  /**
   * Check for debitor students (students with passed next_payment_date)
   * This identifies students whose LATEST payment's next_payment_date has passed
   */
  async checkDuePayments(): Promise<{ count: number; payments: any[] }> {
    this.logger.log(
      "Checking for debitor students with passed next_payment_date",
    );

    try {
      // Set today's date without time for accurate date comparisons
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all students who have payments and are active
      const allPayments = await this.studentPaymentModel.findAll({
        include: [
          {
            model: User,
            as: "student",
            attributes: { exclude: ["password_hash"] },
            where: { is_active: true },
          },
          {
            model: User,
            as: "manager",
            attributes: { exclude: ["password_hash"] },
          },
          {
            model: PaymentAction,
            as: "actions",
            required: false,
          },
        ],
        order: [["next_payment_date", "DESC"]],
      });

      // Group payments by student_id - track both latest completed and any pending
      const studentPaymentsMap = new Map();

      for (const payment of allPayments) {
        if (!studentPaymentsMap.has(payment.student_id)) {
          studentPaymentsMap.set(payment.student_id, {
            latestCompleted: null,
            pending: [],
          });
        }

        const studentPayments = studentPaymentsMap.get(payment.student_id);

        if (payment.status === PaymentStatus.PENDING) {
          studentPayments.pending.push(payment);
        } else if (
          payment.status === PaymentStatus.COMPLETED &&
          !studentPayments.latestCompleted
        ) {
          studentPayments.latestCompleted = payment;
        }
      }

      // Find students with overdue payments (either pending or overdue completed)
      const overduePayments = [];

      for (const [
        studentId,
        { latestCompleted, pending },
      ] of studentPaymentsMap) {
        // Check pending payments first - any pending payment with past next_payment_date is overdue
        for (const pendingPayment of pending) {
          const nextPaymentDate = new Date(pendingPayment.next_payment_date);
          nextPaymentDate.setHours(0, 0, 0, 0);

          if (nextPaymentDate < today) {
            overduePayments.push(pendingPayment);
            this.logger.log(
              `Found pending overdue payment ${pendingPayment.id} for student ${pendingPayment.student_id}`,
            );
            break; // Only add one payment per student
          }
        }

        // If no pending payment was added, check latest completed payment
        if (
          !overduePayments.find((p) => p.student_id === studentId) &&
          latestCompleted
        ) {
          const nextPaymentDate = new Date(latestCompleted.next_payment_date);
          nextPaymentDate.setHours(0, 0, 0, 0);

          if (nextPaymentDate < today) {
            overduePayments.push(latestCompleted);

            // Update status to PENDING for overdue payments that aren't already completed
            if (latestCompleted.status !== PaymentStatus.COMPLETED) {
              await latestCompleted.update({ status: PaymentStatus.PENDING });
              this.logger.log(
                `Updated payment ${latestCompleted.id} status to PENDING for debitor student ${latestCompleted.student_id}`,
              );
            }
          }
        }
      }

      // Return summary information
      return {
        count: overduePayments.length,
        payments: overduePayments.map((payment) => {
          // Get student info safely using toJSON to convert to plain object
          const studentInfo = payment.get({ plain: true });
          const student = studentInfo.student as any;
          const studentName = student
            ? `${student.first_name || ""} ${student.last_name || ""}`.trim()
            : "Unknown";

          return {
            id: payment.id,
            student_id: payment.student_id,
            amount: payment.amount,
            payment_date: payment.payment_date,
            next_payment_date: payment.next_payment_date,
            // Include any related payment actions
            actions: (studentInfo.actions as any[]) || [],
            payment_method: payment.payment_method,
            would_create_new_payment: true,
            new_payment_date: new Date(payment.next_payment_date),
            new_next_payment_date: (() => {
              const date = new Date(payment.next_payment_date);
              date.setMonth(date.getMonth() + 1);
              return date;
            })(),
            notes: payment.notes || "Debitor student - payment overdue",
            // Include these as extra properties that aren't in the DTO
            // These won't cause TypeScript errors as we're using any[] type
            status: payment.status,
            days_overdue: Math.floor(
              (today.getTime() -
                new Date(payment.next_payment_date).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
            student_name: studentName,
            student_phone: student?.phone || null,
          };
        }),
      };
    } catch (error) {
      this.logger.error(`Error checking debitor students: ${error.message}`);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutomaticPaymentCreation() {
    this.logger.log(
      "Running automatic payment creation job for debitor students",
    );

    try {
      // Set today's date without time for accurate date comparisons
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all students who have payments and are active
      const allPayments = await this.studentPaymentModel.findAll({
        include: [
          {
            model: User,
            as: "student",
            attributes: { exclude: ["password_hash"] },
            where: { is_active: true },
          },
          {
            model: User,
            as: "manager",
            attributes: { exclude: ["password_hash"] },
          },
        ],
        order: [["next_payment_date", "DESC"]],
      });

      // Group payments by student_id and get the latest payment for each student
      const studentLatestPayments = new Map();

      for (const payment of allPayments) {
        if (!studentLatestPayments.has(payment.student_id)) {
          studentLatestPayments.set(payment.student_id, payment);
        }
      }

      // Find students whose latest payment's next_payment_date has passed
      const overdueStudents = [];

      for (const [studentId, latestPayment] of studentLatestPayments) {
        const nextPaymentDate = new Date(latestPayment.next_payment_date);
        nextPaymentDate.setHours(0, 0, 0, 0);

        if (nextPaymentDate < today) {
          overdueStudents.push(latestPayment);
        }
      }

      this.logger.log(
        `Found ${overdueStudents.length} students with passed payment dates (debitors)`,
      );

      // Process each overdue student's latest payment
      for (const payment of overdueStudents) {
        // Get student info safely using toJSON to convert to plain object
        const studentInfo = payment.get({ plain: true });
        const student = studentInfo.student as any;
        const studentName = student
          ? `${student.first_name || ""} ${student.last_name || ""}`.trim()
          : "Unknown";

        // Only create new payment records for payments that aren't completed
        if (payment.status !== PaymentStatus.COMPLETED) {
          // First, update the current payment to PENDING if it's not already completed
          await payment.update({ status: PaymentStatus.PENDING });

          // Create a new pending payment record for the next payment cycle
          const newPaymentDate = new Date(payment.next_payment_date);

          // Set the next payment date to one month after the current next_payment_date
          const nextPaymentDate = new Date(payment.next_payment_date);
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

          try {
            // Create the new payment record
            await this.create({
              student_id: payment.student_id,
              manager_id: payment.manager_id,
              amount: payment.amount,
              status: PaymentStatus.PENDING,
              payment_method: payment.payment_method as PaymentMethod,
              payment_date: newPaymentDate,
              next_payment_date: nextPaymentDate,
              notes:
                payment.notes ||
                `Automatically generated for debitor student: ${studentName}`,
            });

            this.logger.log(
              `Created new payment record for debitor student ${payment.student_id} (${studentName}) with next payment date ${nextPaymentDate.toISOString().split("T")[0]}`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to create payment record for debitor student ${payment.student_id} (${studentName}): ${error.message}`,
            );
          }
        }
      }

      this.logger.log(
        "Automatic payment processing for debitor students completed",
      );
    } catch (error) {
      this.logger.error(
        `Error in automatic payment creation job: ${error.message}`,
      );
    }
  }
}
