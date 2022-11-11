import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { mongoose, ReturnModelType } from '@typegoose/typegoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './models/employees.model';
import { Department } from '../departments/models/departments.model';
import { DepartmentsModule } from '../departments/departments.module';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: ReturnModelType<typeof Employee>,
    @InjectModel(Department.name)
    private departmentModel: ReturnModelType<typeof Department>,
  ) {}

  async create(createEmployeeDto: Employee) {
    try {
      let { deptno } = createEmployeeDto;
      let depart = await this.departmentModel.findById(deptno);
      if (depart) {
        const createEmployee = new this.employeeModel(createEmployeeDto);
        await createEmployee.save();
        return {
          message: 'Success',
        };
      } else {
        return {
          message: 'No department inserted.',
        };
      }
      // return result.toJSON() as Department;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.employeeModel.find({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.employeeModel.findOne({ empno: id });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: number, updateEmployeeDto: Employee) {
    try {
      return await this.employeeModel.updateOne(
        { empno: id },
        updateEmployeeDto,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.employeeModel.remove({ empno: id });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
