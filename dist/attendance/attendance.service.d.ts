import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { Attendance } from './entities/attendance.entity.js';
export declare class AttendanceService {
    create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance>;
    findAll(): Promise<Attendance[]>;
    findOne(id: string): Promise<Attendance>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    findByGroupId(group_id: string): Promise<Attendance[]>;
    findByStudentId(student_id: string): Promise<Attendance[]>;
    findByTeacherId(teacher_id: string): Promise<Attendance[]>;
    findByDateRange(startDate: string, endDate: string): Promise<Attendance[]>;
    findByGroupAndDateRange(group_id: string, startDate: string, endDate: string): Promise<Attendance[]>;
    findByStudentAndDateRange(student_id: string, startDate: string, endDate: string): Promise<Attendance[]>;
    findByStatus(status: string): Promise<Attendance[]>;
    getAttendanceStats(group_id?: string, student_id?: string, startDate?: string, endDate?: string): Promise<{
        total: number;
        present: number;
        absent: number;
        late: number;
        attendanceRate: string;
    }>;
}
