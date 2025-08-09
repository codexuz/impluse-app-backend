import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto.js';
export class UpdateCourseDto extends PartialType(CreateCourseDto) {
}
//# sourceMappingURL=update-course.dto.js.map