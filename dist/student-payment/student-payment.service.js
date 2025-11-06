var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StudentPaymentService_1;
import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StudentPayment } from "./entities/student-payment.entity.js";
import { User } from "../users/entities/user.entity.js";
import { StudentWallet } from "../student-wallet/entities/student-wallet.entity.js";
import { StudentTransaction } from "../student-transaction/entities/student-transaction.entity.js";
import { PaymentStatus, } from "./dto/create-student-payment.dto.js";
import { Op } from "sequelize";
let StudentPaymentService = StudentPaymentService_1 = class StudentPaymentService {
    constructor(studentPaymentModel, studentWalletModel, studentTransactionModel) {
        this.studentPaymentModel = studentPaymentModel;
        this.studentWalletModel = studentWalletModel;
        this.studentTransactionModel = studentTransactionModel;
        this.logger = new Logger(StudentPaymentService_1.name);
    }
    async create(createStudentPaymentDto) {
        const transaction = await this.studentPaymentModel.sequelize.transaction();
        try {
            const payment = await this.studentPaymentModel.create({ ...createStudentPaymentDto }, { transaction });
            if (payment.status === 'completed') {
                let wallet = await this.studentWalletModel.findOne({
                    where: { student_id: payment.student_id },
                    transaction,
                });
                if (!wallet) {
                    wallet = await this.studentWalletModel.create({
                        student_id: payment.student_id,
                        amount: 0,
                    }, { transaction });
                }
                const newAmount = wallet.amount + payment.amount;
                await wallet.update({ amount: newAmount }, { transaction });
                await this.studentTransactionModel.create({
                    student_id: payment.student_id,
                    amount: payment.amount,
                    type: 'payment',
                }, { transaction });
                this.logger.log(`Payment completed: Added ${payment.amount} to student ${payment.student_id} wallet. New balance: ${newAmount}`);
            }
            await transaction.commit();
            return payment;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error creating payment:', error);
            throw error;
        }
    }
    async findAll() {
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
    async findOne(id) {
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
    async findByStudent(studentId) {
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
    async findByDateRange(startDate, endDate) {
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
    async findByStatus(status) {
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
    async findUpcomingPayments(days = 7) {
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
                    where: { is_active: true },
                },
                {
                    model: User,
                    as: "manager",
                    attributes: { exclude: ["password_hash"] },
                    where: { is_active: true },
                },
            ],
        });
    }
    async update(id, updateStudentPaymentDto) {
        const payment = await this.findOne(id);
        await payment.update(updateStudentPaymentDto);
        return payment;
    }
    async remove(id) {
        const payment = await this.findOne(id);
        await payment.destroy();
    }
    async updateStatus(id, status) {
        const payment = await this.findOne(id);
        await payment.update({ status });
        return payment;
    }
    async calculateStudentPaymentStatus(studentId) {
        const payments = await this.findByStudent(studentId);
        if (!payments.length) {
            throw new NotFoundException(`No payment records found for student ID "${studentId}"`);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const sortedPayments = [...payments].sort((a, b) => new Date(b.next_payment_date).getTime() -
            new Date(a.next_payment_date).getTime());
        const lastPayment = sortedPayments[0];
        const nextPaymentDate = new Date(lastPayment.next_payment_date);
        nextPaymentDate.setHours(0, 0, 0, 0);
        let paymentStatus = "on_time";
        let daysUntilNextPayment = 0;
        let pendingAmount = 0;
        if (nextPaymentDate < today) {
            paymentStatus = "overdue";
            pendingAmount = Number(lastPayment.amount);
            daysUntilNextPayment =
                Math.floor((today.getTime() - nextPaymentDate.getTime()) / (1000 * 60 * 60 * 24)) * -1;
        }
        else {
            paymentStatus = "upcoming";
            daysUntilNextPayment = Math.floor((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        }
        const result = {
            totalPaid,
            pendingAmount,
            paymentStatus,
            daysUntilNextPayment,
            nextPaymentDate,
            _debug: {
                totalPayments: payments.length,
                lastPaymentDate: lastPayment.payment_date,
                lastPaymentNextDate: lastPayment.next_payment_date,
                today: today.toISOString().split("T")[0],
                isExpired: nextPaymentDate < today,
            },
        };
        delete result._debug;
        return result;
    }
    async checkDuePayments() {
        this.logger.log("Checking for debitor students with passed next_payment_date");
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
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
                order: [['next_payment_date', 'DESC']]
            });
            const studentLatestPayments = new Map();
            for (const payment of allPayments) {
                if (!studentLatestPayments.has(payment.student_id)) {
                    studentLatestPayments.set(payment.student_id, payment);
                }
            }
            const overduePayments = [];
            for (const [studentId, latestPayment] of studentLatestPayments) {
                const nextPaymentDate = new Date(latestPayment.next_payment_date);
                nextPaymentDate.setHours(0, 0, 0, 0);
                if (nextPaymentDate < today) {
                    overduePayments.push(latestPayment);
                    if (latestPayment.status !== PaymentStatus.COMPLETED) {
                        await latestPayment.update({ status: PaymentStatus.PENDING });
                        this.logger.log(`Updated payment ${latestPayment.id} status to PENDING for debitor student ${latestPayment.student_id}`);
                    }
                }
            }
            return {
                count: overduePayments.length,
                payments: overduePayments.map((payment) => {
                    const studentInfo = payment.get({ plain: true });
                    const student = studentInfo.student;
                    const studentName = student
                        ? `${student.first_name || ''} ${student.last_name || ''}`.trim()
                        : 'Unknown';
                    return {
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
                        notes: payment.notes || "Debitor student - payment overdue",
                        status: payment.status,
                        days_overdue: Math.floor((today.getTime() - new Date(payment.next_payment_date).getTime()) / (1000 * 60 * 60 * 24)),
                        student_name: studentName
                    };
                }),
            };
        }
        catch (error) {
            this.logger.error(`Error checking debitor students: ${error.message}`);
            throw error;
        }
    }
    async handleAutomaticPaymentCreation() {
        this.logger.log("Running automatic payment creation job for debitor students");
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
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
                order: [['next_payment_date', 'DESC']]
            });
            const studentLatestPayments = new Map();
            for (const payment of allPayments) {
                if (!studentLatestPayments.has(payment.student_id)) {
                    studentLatestPayments.set(payment.student_id, payment);
                }
            }
            const overdueStudents = [];
            for (const [studentId, latestPayment] of studentLatestPayments) {
                const nextPaymentDate = new Date(latestPayment.next_payment_date);
                nextPaymentDate.setHours(0, 0, 0, 0);
                if (nextPaymentDate < today) {
                    overdueStudents.push(latestPayment);
                }
            }
            this.logger.log(`Found ${overdueStudents.length} students with passed payment dates (debitors)`);
            for (const payment of overdueStudents) {
                const studentInfo = payment.get({ plain: true });
                const student = studentInfo.student;
                const studentName = student
                    ? `${student.first_name || ''} ${student.last_name || ''}`.trim()
                    : 'Unknown';
                if (payment.status !== PaymentStatus.COMPLETED) {
                    await payment.update({ status: PaymentStatus.PENDING });
                    const newPaymentDate = new Date(payment.next_payment_date);
                    const nextPaymentDate = new Date(payment.next_payment_date);
                    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                    try {
                        await this.create({
                            student_id: payment.student_id,
                            manager_id: payment.manager_id,
                            amount: payment.amount,
                            status: PaymentStatus.PENDING,
                            payment_method: payment.payment_method,
                            payment_date: newPaymentDate,
                            next_payment_date: nextPaymentDate,
                            notes: payment.notes || `Automatically generated for debitor student: ${studentName}`,
                        });
                        this.logger.log(`Created new payment record for debitor student ${payment.student_id} (${studentName}) with next payment date ${nextPaymentDate.toISOString().split("T")[0]}`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to create payment record for debitor student ${payment.student_id} (${studentName}): ${error.message}`);
                    }
                }
            }
            this.logger.log("Automatic payment processing for debitor students completed");
        }
        catch (error) {
            this.logger.error(`Error in automatic payment creation job: ${error.message}`);
        }
    }
};
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentPaymentService.prototype, "handleAutomaticPaymentCreation", null);
StudentPaymentService = StudentPaymentService_1 = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentPayment)),
    __param(1, InjectModel(StudentWallet)),
    __param(2, InjectModel(StudentTransaction)),
    __metadata("design:paramtypes", [Object, Object, Object])
], StudentPaymentService);
export { StudentPaymentService };
//# sourceMappingURL=student-payment.service.js.map