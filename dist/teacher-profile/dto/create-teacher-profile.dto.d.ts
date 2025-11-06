export declare enum PaymentType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare class CreateTeacherProfileDto {
    user_id: string;
    payment_type?: PaymentType;
    payment_value?: number;
    payment_day?: number;
}
