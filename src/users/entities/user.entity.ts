import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'users'})
export class User extends Model<InferCreationAttributes<User>,InferAttributes<User>>{

    @Column ({ primaryKey: true, autoIncrement : true})
    id:number;

    @Column
    user_name:string;

    @Column
    user_email:string;

    @Column
    age:number;

    @Column
    mobile_no:string;
}
