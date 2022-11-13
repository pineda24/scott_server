import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      const createEmployee = new this.employeeModel(createEmployeeDto);
      return await createEmployee
        .save()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.employeeModel.aggregate([
        {
          $lookup: {
            from: 'departments',
            localField: 'deptno',
            foreignField: '_id',
            as: 'departmentname',
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'mgr',
            foreignField: '_id',
            as: 'manager',
          },
        },
        {
          $project: {
            _id: 1,
            empno: 1,
            ename: 1,
            job: 1,
            mgr: {
              $cond: {
                if: { $and: [{ $gt: [{ $size: '$manager.empno' }, 0] }] },
                then: { $arrayElemAt: ['$manager.empno', 0] },
                else: null,
              },
            },
            hiredate: 1,
            sal: 1,
            comm: 1,
            deptno: 1,
            employees: 1,
            nameDept: {
              $cond: {
                if: {
                  $and: [{ $gt: [{ $size: '$departmentname.dname' }, 0] }],
                },
                then: { $arrayElemAt: ['$departmentname.dname', 0] },
                else: null,
              },
            },
          },
        },
      ]);
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
      // console.log(updateEmployeeDto);
      let { empno, ename, job, mgr, hiredate, sal, comm, deptno } =
        updateEmployeeDto;
      let emplo = new Employee();
      emplo.empno = empno ? empno : -1;
      emplo.ename = ename ? ename : "";
      emplo.job = job ? job : "";
      emplo.mgr = mgr ? mgr : null;
      emplo.hiredate = hiredate ? hiredate : new Date();
      emplo.sal = sal ? sal : 0;
      emplo.comm = comm ? comm : null;
      emplo.deptno = deptno ? deptno : null;
      return await this.employeeModel
        .updateOne({ empno: id }, emplo)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: number) {

    try {
      let emp = await this.employeeModel.aggregate([
        {
          $match: {
            empno: id,
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: 'mgr',
            as: 'noemployees',
          },
        },
        {
          $project: {
            _id: 1,
            empno: 1,
            noemployees: {
              $cond: {
                if: { $isArray: '$noemployees' },
                then: { $size: '$noemployees' },
                else: 0,
              },
            },
          },
        },
        {
          $limit: 1,
        },
      ]);
      if(emp && emp.length > 0){
        if(emp[0].noemployees == 0) return await this.employeeModel.deleteOne({ empno: id });
        else throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Employee has subordinates.',
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      } else if (emp.length == 0) {
        throw new NotFoundException('Employee not found.');
      } else {
        throw new InternalServerErrorException('Found Unespected Error');
      }
    } catch (e) {
      throw e;
    }
  }

}