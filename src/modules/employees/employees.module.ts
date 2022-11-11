import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee } from './models/employees.model';
import { Department } from '../departments/models/departments.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.modelName, schema: Employee.model.schema },
    ]),
    MongooseModule.forFeature([
      { name: Department.modelName, schema: Department.model.schema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService]
})
export class EmployeesModule {}
