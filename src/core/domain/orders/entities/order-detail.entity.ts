import { Type } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  Min,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';

export class OrderDetail {
  id?: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsInt()
  @Min(1)
  orderId: number;

  @IsInt()
  @Min(1)
  productId: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
