import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Department } from './models/departments.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.modelName, schema: Department.model.schema },
    ]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
