// import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
// import { AutoMap } from '@nartc/automapper';
// import { Department } from 'src/modules/departments/models/departments.model';

// export class Employee{

//     @prop({ required: [true,'empno is required'], unique: true, validate: /^[0-9]{1,4}$/ })
//     @AutoMap()
//     empno: number;

//     @prop({ required: [true,'ename is required'], validate: /^[a-zA-F]{1,10}$/ })
//     @AutoMap()
// 	ename: String;

//     @prop({ required: [true,'job is required'] , validate: /^[a-zA-F]{1,9}$/ })
//     @AutoMap()
// 	job: String;

//     @prop({ required: [true,'job is required'], ref: () => Employee, default: null })
//     @AutoMap()
// 	mgr: Ref<Employee>;

//     @prop({ required: [true,'hiredate is required'] })
//     @AutoMap()
// 	hiredate: Date;

//     @prop({ required: [true,'sal is required'], default: 0 })
//     @AutoMap()
// 	sal: number;

//     @prop({ required: [true,'comm is required'], default: null })
//     @AutoMap()
// 	comm: number;

//     @prop({ required: [true,'deptno is required'], ref: () => Department })
//     @AutoMap()
// 	deptno: Ref<Department>

//     static get model(): ReturnModelType<typeof Employee> {
//         return getModelForClass(Employee, { schemaOptions });
//     }

//     static get modelName(): string {
//         return this.model.modelName;
//     }

//     // static createModel(params?: any): InstanceType<Department> {
//     //     return new this.model(params);
//     // }
// }

import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Department } from 'src/modules/departments/models/departments.model';

export class Employee{

    @prop({ required: [true,'empno is required'], unique: true, validate: /^[0-9]{1,4}$/ })
    @AutoMap()
    empno: number;

    @prop({ required: [true,'ename is required'] })
    @AutoMap()
	ename: String;

    @prop({ required: [true,'job is required'] })
    @AutoMap()
	job: String;

    @prop({ required: [false,'mgr is required'], ref: () => Employee, default: null })
    @AutoMap()
	mgr: Ref<Employee>;

    @prop({ required: [true,'hiredate is required'] })
    @AutoMap()
	hiredate: Date;

    @prop({ required: [true,'sal is required'], validate: /^[0-9]{1,7}(\.([0-9]{1,2}))?$/, default: 0 })
    @AutoMap()
	sal: number;

    @prop({ required: [false,'comm is required'], default: null })
    @AutoMap()
	comm: number;

    @prop({ required: [true,'deptno is required'], ref: () => Department })
    @AutoMap()
	deptno: Ref<Department>

    static get model(): ReturnModelType<typeof Employee> {
        return getModelForClass(Employee, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    // static createModel(params?: any): InstanceType<Department> {
    //     return new this.model(params);
    // }
}
