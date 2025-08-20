import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Order } from '../../orders/entities/order.entity';
import { Type } from 'class-transformer';

export class Customer {
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Order)
  orders?: Order[];
}
