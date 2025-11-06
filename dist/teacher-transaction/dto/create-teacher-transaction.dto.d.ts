export declare enum TeacherTransactionType {
    OYLIK = "oylik",
    JARIMA = "jarima",
    AVANS = "avans"
}
export declare class CreateTeacherTransactionDto {
    teacher_id: string;
    amount: number;
    type: TeacherTransactionType;
}
