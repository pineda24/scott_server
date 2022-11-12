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

  // async create(createEmployeeDto: Employee) {
  //   try {
  //     let { deptno } = createEmployeeDto;
  //     let depart = await this.departmentModel.findById(deptno);
  //     if (depart) {
  //       const createEmployee = new this.employeeModel(createEmployeeDto);
  //       await createEmployee.save();
  //       return {
  //         message: 'Success',
  //       };
  //     } else {
  //       return {
  //         message: 'No department inserted.',
  //       };
  //     }
  //     // return result.toJSON() as Department;
  //   } catch (e) {
  //     throw new InternalServerErrorException(e);
  //   }
  // }

  async create(createEmployeeDto: Employee) {
    try {
      const createEmployee = new this.employeeModel(createEmployeeDto);
      return await createEmployee.save();
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


      // let employee = new Object({ 
      //   empno:empno ? empno : -1, 
      //   ename:ename ? ename : "", 
      //   job:job ? job : "", 
      //   mgr:mgr ? mgr : null, 
      //   hiredate:hiredate ? hiredate : Date(), 
      //   sal:sal ? sal : 0, 
      //   comm:comm ? comm : null, 
      //   deptno:deptno ? deptno : null
      // });
      let exu = await this.employeeModel.updateOne(
        { empno: id },
        emplo,
      );
      console.log(exu);
      return exu;
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
