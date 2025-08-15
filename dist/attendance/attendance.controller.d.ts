import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto): Promise<import("./entities/attendance.entity.js").Attendance>;
    findAll(): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByGroup(groupId: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByStudent(studentId: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByTeacher(teacherId: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByStatus(status: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByDateRange(startDate: string, endDate: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByGroupAndDateRange(groupId: string, startDate: string, endDate: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    findByStudentAndDateRange(studentId: string, startDate: string, endDate: string): Promise<import("./entities/attendance.entity.js").Attendance[]>;
    getAttendanceStats(groupId?: string, studentId?: string, startDate?: string, endDate?: string): Promise<{
        total: number;
        present: number;
        absent: number;
        late: number;
        attendanceRate: string;
    }>;
    findOne(id: string): Promise<import("./entities/attendance.entity.js").Attendance>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<import("./entities/attendance.entity.js").Attendance>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
