import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsNumber,
  IsPositive,
  ValidateNested,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Order } from '../../orders/entities/order.entity';
import { Type } from 'class-transformer';
import { DeliveryStatusEnum } from '../enums/delivery-status.enum';

export { DeliveryStatusEnum };

export class Delivery {
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  trackingNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shippingAddress: string;

  @IsNumber()
  @IsPositive()
  fee: number;

  @IsEnum(DeliveryStatusEnum)
  status: DeliveryStatusEnum;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @ValidateNested()
  order?: Order;
}
