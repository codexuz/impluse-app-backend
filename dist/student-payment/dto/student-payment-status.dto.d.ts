export declare class StudentPaymentStatusDto {
    totalPaid: number;
    pendingAmount: number;
    paymentStatus: 'on_time' | 'overdue' | 'upcoming';
    daysUntilNextPayment: number;
    nextPaymentDate: Date;
}
