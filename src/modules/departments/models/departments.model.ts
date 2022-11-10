import { ReturnModelType, prop, getModelForClass, types } from '@typegoose/typegoose';
import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';

export class Department extends BaseModel<Department> {
    @prop({ required: [true,'clientId is required'],unique: true })
    @AutoMap()
    deptno: number;

    @prop({ required: [true, 'dName is required'] })
    @AutoMap()
    dName: string;

    @prop({ required: [true, 'loc is required'] })
    @AutoMap()
    loc: string;

    static get model(): ReturnModelType<typeof Department> {
        return getModelForClass(Department, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    // static createModel(params?: any): InstanceType<Department> {
    //     return new this.model(params);
    // }
}
