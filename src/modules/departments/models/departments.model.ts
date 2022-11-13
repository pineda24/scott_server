import { ReturnModelType, prop, getModelForClass, types } from '@typegoose/typegoose';
import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';

export class Department{
    @prop({ required: [true,'Attribute deptno is required'], unique: true })
    @AutoMap()
    deptno: number;

    @prop({ required: [true, 'Attribute dname is required'] })
    @AutoMap()
    dname: string;

    @prop({ required: [true, 'Attribute loc is required'] })
    @AutoMap()
    loc: string;

    static get model(): ReturnModelType<typeof Department> {
        return getModelForClass(Department, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
