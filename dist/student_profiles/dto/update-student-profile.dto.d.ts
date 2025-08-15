import { CreateStudentProfileDto } from './create-student-profile.dto.js';
declare const UpdateStudentProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateStudentProfileDto>>;
export declare class UpdateStudentProfileDto extends UpdateStudentProfileDto_base {
    points?: number;
    coins?: number;
    streaks?: number;
}
export {};
