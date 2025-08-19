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
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StudentPayment } from './entities/student-payment.entity.js';
import { PaymentStatus } from './dto/create-student-payment.dto.js';
import { Op } from 'sequelize';
let StudentPaymentService = StudentPaymentService_1 = class StudentPaymentService {
    constructor(studentPaymentModel) {
        this.studentPaymentModel = studentPaymentModel;
        this.logger = new Logger(StudentPaymentService_1.name);
    }
    async create(createStudentPaymentDto) {
        return this.studentPaymentModel.create({ ...createStudentPaymentDto });
    }
    async findAll() {
        return this.studentPaymentModel.findAll();
    }
    async findOne(id) {
        const payment = await this.studentPaymentModel.findByPk(id);
        if (!payment) {
            throw new NotFoundException(`Payment with ID "${id}" not found`);
        }
        return payment;
    }
    async findByStudent(studentId) {
        return this.studentPaymentModel.findAll({
            where: { student_id: studentId }
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.studentPaymentModel.findAll({
            where: {
                payment_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    }
    async findByStatus(status) {
        return this.studentPaymentModel.findAll({
            where: { status }
        });
    }
    async findUpcomingPayments(days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        return this.studentPaymentModel.findAll({
            where: {
                next_payment_date: {
                    [Op.between]: [today, futureDate]
                }
            }
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
        const sortedPayments = [...payments].sort((a, b) => new Date(b.next_payment_date).getTime() - new Date(a.next_payment_date).getTime());
        const lastPayment = sortedPayments[0];
        const nextPaymentDate = new Date(lastPayment.next_payment_date);
        nextPaymentDate.setHours(0, 0, 0, 0);
        let paymentStatus = 'on_time';
        let daysUntilNextPayment = 0;
        let pendingAmount = 0;
        if (nextPaymentDate < today) {
            paymentStatus = 'overdue';
            pendingAmount = Number(lastPayment.amount);
            daysUntilNextPayment = Math.floor((today.getTime() - nextPaymentDate.getTime()) / (1000 * 60 * 60 * 24)) * -1;
        }
        else {
            paymentStatus = 'upcoming';
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
                today: today.toISOString().split('T')[0],
                isExpired: nextPaymentDate < today
            }
        };
        delete result._debug;
        return result;
    }
    async checkDuePayments() {
        this.logger.log('Checking for payments with passed next_payment_date');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const overduePayments = await this.studentPaymentModel.findAll({
                where: {
                    status: PaymentStatus.PENDING,
                    next_payment_date: {
                        [Op.lt]: today
                    }
                }
            });
            return {
                count: overduePayments.length,
                payments: overduePayments.map(payment => ({
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
                    })()
                }))
            };
        }
        catch (error) {
            this.logger.error(`Error checking due payments: ${error.message}`);
            throw error;
        }
    }
    async handleAutomaticPaymentCreation() {
        this.logger.log('Running automatic payment creation job');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const overduePayments = await this.studentPaymentModel.findAll({
                where: {
                    status: PaymentStatus.PENDING,
                    next_payment_date: {
                        [Op.lt]: today
                    }
                }
            });
            this.logger.log(`Found ${overduePayments.length} payment records with passed next_payment_date`);
            for (const payment of overduePayments) {
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
                        next_payment_date: nextPaymentDate
                    });
                    this.logger.log(`Created new payment record for student ${payment.student_id} with next payment date ${nextPaymentDate.toISOString().split('T')[0]}`);
                }
                catch (error) {
                    this.logger.error(`Failed to create payment record for student ${payment.student_id}: ${error.message}`);
                }
            }
            this.logger.log('Automatic payment creation job completed');
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
    __metadata("design:paramtypes", [Object])
], StudentPaymentService);
export { StudentPaymentService };
//# sourceMappingURL=student-payment.service.js.map