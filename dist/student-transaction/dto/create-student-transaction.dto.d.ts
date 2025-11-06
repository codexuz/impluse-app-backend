export declare enum TransactionType {
    LESSON_WITHDRAWAL = "lesson_withdrawal",
    PAYMENT = "payment",
    REFUND = "refund"
}
export declare class CreateStudentTransactionDto {
    student_id: string;
    amount: number;
    type: TransactionType;
}
