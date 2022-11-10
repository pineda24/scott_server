import { ApiProperty } from '@nestjs/swagger';
import { SchemaOptions } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class BaseModelVm {
    @ApiProperty({ type: String, format: 'date-time' })
    @Expose()
    createdAt?: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    @Expose()
    updatedAt?: Date;

    @ApiProperty() 
    @Expose()
    id?: string;
}

export abstract class BaseModel<T>{
    @prop()
    @ApiProperty({ type: String, format: 'date-time' })
    @Expose()
    createdAt: Date;

    @prop()
    @ApiProperty({ type: String, format: 'date-time' })
    @Expose()
    updatedAt: Date;

    @ApiProperty()
    @Expose()
    id: string;
}

export class FilterBaseModel<T>  extends BaseModel<T>{
    @ApiProperty({ type: Number })
    @Expose()
    limit?: number;

    @ApiProperty({ type: Number })
    @Expose()
    skip?: number;

    @ApiProperty({ type: Number })
    @Expose()
    sort?: string;

    @ApiProperty({ type: Number })
    @Expose()
    sortDirection?: number;

    
}

export const schemaOptions: SchemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
};
