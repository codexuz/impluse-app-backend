export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum PaymentMethod {
    CASH = "Naqd",
    CARD = "Karta",
    CLICK = "Click",
    PAYME = "Payme"
}
export declare class CreateStudentPaymentDto {
    student_id: string;
    manager_id: string;
    amount: number;
    status: PaymentStatus;
    payment_method: PaymentMethod;
    payment_date: Date;
    next_payment_date: Date;
    notes?: string;
}
