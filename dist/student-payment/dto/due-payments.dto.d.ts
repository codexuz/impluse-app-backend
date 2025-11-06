export declare class DuePaymentItemDto {
    id: string;
    student_id: string;
    amount: number;
    payment_date: Date;
    next_payment_date: Date;
    payment_method: string;
    would_create_new_payment: boolean;
    new_payment_date: Date;
    new_next_payment_date: Date;
    notes?: string;
}
export declare class DuePaymentsResponseDto {
    count: number;
    payments: DuePaymentItemDto[];
}
