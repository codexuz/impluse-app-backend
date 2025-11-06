export declare enum DayTimeType {
    ODD = "odd",
    EVEN = "even",
    BOTH = "both"
}
export declare class LessonScheduleResponseDto {
    id: string;
    group_id: string;
    group?: any;
    room_number: string;
    day_time: DayTimeType;
    start_time?: string;
    end_time?: string;
    created_at: Date;
    updated_at: Date;
}
