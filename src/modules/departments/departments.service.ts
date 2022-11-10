import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './models/departments.model';
import { Model } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: ReturnModelType<typeof Department>,
  ) {}

  async create(createDepartmentDto: Department) {
    try {
      const createdDepart = new this.departmentModel(createDepartmentDto);
      return await createdDepart.save();
      // return result.toJSON() as Department;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.departmentModel.find({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.departmentModel.findOne({"deptno": id});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: number, updateDepartmentDto: Department) {
    try {
      return await this.departmentModel.updateOne({"deptno": id},updateDepartmentDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.departmentModel.remove({"deptno": id});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
