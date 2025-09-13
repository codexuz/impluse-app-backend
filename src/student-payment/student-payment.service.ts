import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StudentPayment } from "./entities/student-payment.entity.js";
import { User } from "../users/entities/user.entity.js";
import {
  CreateStudentPaymentDto,
  PaymentStatus,
  PaymentMethod,
} from "./dto/create-student-payment.dto.js";
import { UpdateStudentPaymentDto } from "./dto/update-student-payment.dto.js";
import { StudentPaymentStatusDto } from "./dto/student-payment-status.dto.js";
import { Op, fn, col, literal } from "sequelize";

@Injectable()
export class StudentPaymentService {
  private readonly logger = new Logger(StudentPaymentService.name);

  constructor(
    @InjectModel(StudentPayment)
    private studentPaymentModel: typeof StudentPayment
  ) {}

  async create(
    createStudentPaymentDto: CreateStudentPaymentDto
  ): Promise<StudentPayment> {
    return this.studentPaymentModel.create({ ...createStudentPaymentDto });
  }

  async findAll(): Promise<StudentPayment[]> {
    return this.studentPaymentModel.findAll({
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

  async findByStudent(studentId: string): Promise<StudentPayment[]> {
    return this.studentPaymentModel.findAll({
      where: { student_id: studentId },
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

  async findByDateRange(
    startDate: Date,
    endDate: Date
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

  async findByStatus(status: PaymentStatus): Promise<StudentPayment[]> {
    return this.studentPaymentModel.findAll({
      where: { status },
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

  async findUpcomingPayments(days: number = 7): Promise<StudentPayment[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.studentPaymentModel.findAll({
      where: {
        next_payment_date: {
          [Op.between]: [today, futureDate],
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

  async update(
    id: string,
    updateStudentPaymentDto: UpdateStudentPaymentDto
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
    status: PaymentStatus
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
    studentId: string
  ): Promise<StudentPaymentStatusDto> {
    // Get all payments for this student
    const payments = await this.findByStudent(studentId);

    if (!payments.length) {
      throw new NotFoundException(
        `No payment records found for student ID "${studentId}"`
      );
    }

    // Set today's date without time for accurate date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate total paid amount (all payments are completed)
    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    // Get the most recent payment (sorted by next_payment_date in descending order)
    const sortedPayments = [...payments].sort(
      (a, b) =>
        new Date(b.next_payment_date).getTime() -
        new Date(a.next_payment_date).getTime()
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
          (today.getTime() - nextPaymentDate.getTime()) / (1000 * 60 * 60 * 24)
        ) * -1; // Negative number of days (overdue)
    } else {
      // Payment is still valid
      paymentStatus = "upcoming";
      daysUntilNextPayment = Math.floor(
        (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
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
   * Check which payments would be processed by the automatic payment creation job
   * without actually creating new payments. Useful for testing and monitoring.
   */
  async checkDuePayments() {
    this.logger.log("Checking for payments with passed next_payment_date");

    try {
      // Set today's date without time for accurate date comparisons
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all pending payments with next_payment_date in the past
      const overduePayments = await this.studentPaymentModel.findAll({
        where: {
          status: PaymentStatus.PENDING,
          next_payment_date: {
            [Op.lt]: today,
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

      // Return summary information
      return {
        count: overduePayments.length,
        payments: overduePayments.map((payment) => ({
          id: payment.id,
          student_id: payment.student_id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          next_payment_date: payment.next_payment_date,
          payment_method: payment.payment_method,
          would_create_new_payment: true,
          new_payment_date: new Date(payment.next_payment_date),
          new_next_payment_date: (() => {
            const date = new Date(payment.next_payment_date);
            date.setMonth(date.getMonth() + 1);
            return date;
          })(),
          notes: payment.notes || "Automatically detected due payment",
        })),
      };
    } catch (error) {
      this.logger.error(`Error checking due payments: ${error.message}`);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutomaticPaymentCreation() {
    this.logger.log("Running automatic payment creation job");

    try {
      // Set today's date without time for accurate date comparisons
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all pending payments with next_payment_date in the past
      const overduePayments = await this.studentPaymentModel.findAll({
        where: {
          status: PaymentStatus.PENDING,
          next_payment_date: {
            [Op.lt]: today,
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

      this.logger.log(
        `Found ${overduePayments.length} payment records with passed next_payment_date`
      );

      // Process each overdue payment
      for (const payment of overduePayments) {
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
            notes: payment.notes || "Automatically generated renewal payment",
          });

          this.logger.log(
            `Created new payment record for student ${payment.student_id} with next payment date ${nextPaymentDate.toISOString().split("T")[0]}`
          );
        } catch (error) {
          this.logger.error(
            `Failed to create payment record for student ${payment.student_id}: ${error.message}`
          );
        }
      }

      this.logger.log("Automatic payment creation job completed");
    } catch (error) {
      this.logger.error(
        `Error in automatic payment creation job: ${error.message}`
      );
    }
  }
}
