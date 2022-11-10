import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentsModule } from './modules/departments/departments.module';
import { EmployeesModule } from './modules/employees/employees.module';

// Typegoose


@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb://localhost:27017/scottmanager",
      {
        useNewUrlParser: true,
      }
    ),
    DepartmentsModule,
    EmployeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
