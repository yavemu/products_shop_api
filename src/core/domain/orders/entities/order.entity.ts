import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDetail } from './order-detail.entity';
import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';

export class Order {
  id?: number;

  @IsNumber()
  @IsPositive()
  deliveryId: number;

  @IsNumber()
  @IsPositive()
  customerId: number;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetail)
  orderDetails: OrderDetail[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Transaction)
  transactions?: Transaction[];

  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @ValidateNested()
  @Type(() => Delivery)
  delivery?: Delivery;
}
