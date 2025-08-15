export declare enum TrialLessonStatus {
    BELGILANGAN = "belgilangan",
    KELDI = "keldi",
    KELMADI = "kelmadi"
}
export declare class CreateLeadTrialLessonDto {
    scheduledAt: Date;
    status: TrialLessonStatus;
    teacher_id: string;
    lead_id: string;
    notes: string;
}
