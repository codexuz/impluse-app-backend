export declare class CreateExpenseDto {
    title: string;
    category_id: string;
    description?: string;
    amount: number;
    expense_date: Date;
    teacher_id?: string;
    reported_by?: string;
}
