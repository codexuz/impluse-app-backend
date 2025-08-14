import { StudentPayment } from './entities/student-payment.entity.js';
import { CreateStudentPaymentDto, PaymentStatus } from './dto/create-student-payment.dto.js';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto.js';
import { StudentPaymentStatusDto } from './dto/student-payment-status.dto.js';
export declare class StudentPaymentService {
    private studentPaymentModel;
    private readonly logger;
    constructor(studentPaymentModel: typeof StudentPayment);
    create(createStudentPaymentDto: CreateStudentPaymentDto): Promise<StudentPayment>;
    findAll(): Promise<StudentPayment[]>;
    findOne(id: string): Promise<StudentPayment>;
    findByStudent(studentId: string): Promise<StudentPayment[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<StudentPayment[]>;
    findByStatus(status: PaymentStatus): Promise<StudentPayment[]>;
    findUpcomingPayments(days?: number): Promise<StudentPayment[]>;
    update(id: string, updateStudentPaymentDto: UpdateStudentPaymentDto): Promise<StudentPayment>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: PaymentStatus): Promise<StudentPayment>;
    calculateStudentPaymentStatus(studentId: string): Promise<StudentPaymentStatusDto>;
    checkDuePayments(): Promise<{
        count: number;
        payments: {
            id: string;
            student_id: string;
            amount: number;
            payment_date: Date;
            next_payment_date: Date;
            payment_method: string;
            would_create_new_payment: boolean;
            new_payment_date: Date;
            new_next_payment_date: Date;
        }[];
    }>;
    handleAutomaticPaymentCreation(): Promise<void>;
}
