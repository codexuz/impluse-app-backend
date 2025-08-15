export declare class CreateLessonDto {
    title: string;
    order: number;
    isActive?: boolean;
    type?: 'lesson' | 'practice' | 'test';
    moduleId?: string;
}
