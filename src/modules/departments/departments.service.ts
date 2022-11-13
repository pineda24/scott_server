import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './models/departments.model';
import { Model } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Employee } from '../employees/models/employees.model';
import { Console } from 'console';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: ReturnModelType<typeof Department>,
    @InjectModel(Employee.name)
    private employeeModel: ReturnModelType<typeof Employee>,
  ) {}

  async create(createDepartmentDto: Department) {
    try {
      const createdDepart = new this.departmentModel(createDepartmentDto);
      return await createdDepart
        .save()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } catch (e) {
      throw new InternalServerErrorException('Found Unespected Error');
    }
  }

  async findAll() {
    try {
      return await this.departmentModel.aggregate([
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: 'deptno',
            as: 'noemployees',
          },
        },
        {
          $project: {
            _id: 1,
            deptno: 1,
            loc: 1,
            createdAt: 1,
            updatedAt: 1,
            dname: 1,
            noemployees: {
              $cond: {
                if: { $isArray: '$noemployees' },
                then: { $size: '$noemployees' },
                else: 0,
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
      return await this.departmentModel.findOne({ deptno: id });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: number, updateDepartmentDto: Department) {
    try {
      return await this.departmentModel
        .updateOne({ deptno: id }, updateDepartmentDto)
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
      let dept = await this.departmentModel.aggregate([
        {
          $match: {
            deptno: id,
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: 'deptno',
            as: 'noemployees',
          },
        },
        {
          $project: {
            _id: 1,
            deptno: 1,
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
      if(dept && dept.length > 0){
        if(dept[0].noemployees == 0) return await this.departmentModel.deleteOne({ deptno: id });
        else throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Department has employees.',
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      } else if (dept.length == 0) {
        throw new NotFoundException('Department not found.');
      } else {
        throw new InternalServerErrorException('Found Unespected Error');
      }
    } catch (e) {
      throw e;
    }
  }
}
