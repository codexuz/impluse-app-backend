import { PaymentStatus, PaymentMethod } from "./create-student-payment.dto.js";
export declare class CreateStudentPaymentRequestDto {
    student_id: string;
    amount: number;
    status: PaymentStatus;
    payment_method: PaymentMethod;
    payment_date: Date;
    next_payment_date: Date;
    notes?: string;
}
