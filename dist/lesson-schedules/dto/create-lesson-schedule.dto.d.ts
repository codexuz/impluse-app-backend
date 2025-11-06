export declare enum DayTimeType {
    ODD = "odd",
    EVEN = "even",
    BOTH = "both"
}
export declare class CreateLessonScheduleDto {
    group_id: string;
    room_number: string;
    day_time: DayTimeType;
    start_time?: Date;
    end_time?: Date;
}
