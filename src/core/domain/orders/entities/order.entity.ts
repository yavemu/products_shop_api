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
import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm-entity';

export class Order {
  id?: number;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsString()
  shippingAddress: string;

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
}
