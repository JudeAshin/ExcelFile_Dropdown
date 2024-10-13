import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column,Model,Table } from "sequelize-typescript";

@Table({ tableName : 'Customers'})  
export class Customer extends Model<InferCreationAttributes<Customer>,InferAttributes<Customer>>{
@Column ({ autoIncrement : true, primaryKey:true})
id:number;

@Column
customer_name:string;

@Column
customer_email:string;

@Column
customer_address:string;

@Column
mobile_no:string;

@Column
total_amount:number;

@Column
discount:string;

@Column
product_name:string;

@Column
state:string;

@Column
city:string; 

@Column
pincode:number;

}