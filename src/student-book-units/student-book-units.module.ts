import { Module } from '@nestjs/common';
import { StudentBookUnitsService } from './student-book-units.service.js';
import { StudentBookUnitsController } from './student-book-units.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentBookUnit } from './entities/student-book-unit.entity.js';
@Module({
  imports: [SequelizeModule.forFeature([StudentBookUnit])],
  controllers: [StudentBookUnitsController],
  providers: [StudentBookUnitsService],
  exports: [StudentBookUnitsService],
})
export class StudentBookUnitsModule {}
