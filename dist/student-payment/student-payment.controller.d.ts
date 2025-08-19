import { StudentPaymentService } from './student-payment.service.js';
import { CreateStudentPaymentDto } from './dto/create-student-payment.dto.js';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto.js';
import { StudentPaymentStatusDto } from './dto/student-payment-status.dto.js';
import { DuePaymentsResponseDto } from './dto/due-payments.dto.js';
export declare class StudentPaymentController {
    private readonly studentPaymentService;
    constructor(studentPaymentService: StudentPaymentService);
    create(createStudentPaymentDto: CreateStudentPaymentDto): Promise<import("./entities/student-payment.entity.js").StudentPayment>;
    findAll(): Promise<import("./entities/student-payment.entity.js").StudentPayment[]>;
    findByStudent(studentId: string): Promise<import("./entities/student-payment.entity.js").StudentPayment[]>;
    getStudentPaymentStatus(studentId: string): Promise<StudentPaymentStatusDto>;
    findUpcomingPayments(days: number): Promise<import("./entities/student-payment.entity.js").StudentPayment[]>;
    findByStatus(status: string): Promise<import("./entities/student-payment.entity.js").StudentPayment[]>;
    findOne(id: string): Promise<import("./entities/student-payment.entity.js").StudentPayment>;
    update(id: string, updateStudentPaymentDto: UpdateStudentPaymentDto): Promise<import("./entities/student-payment.entity.js").StudentPayment>;
    updateStatus(id: string, status: 'pending' | 'completed' | 'failed'): Promise<import("./entities/student-payment.entity.js").StudentPayment>;
    remove(id: string): Promise<void>;
    triggerPaymentCreation(): Promise<{
        message: string;
    }>;
    checkDuePayments(): Promise<DuePaymentsResponseDto>;
}
