import { Type } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
  MaxLength,
  IsUrl,
  IsOptional,
  IsDate,
} from 'class-validator';

export class Product {
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brand: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsPositive()
  price: number;

  @IsUrl()
  mainImage: string;

  @IsUrl()
  thumbnail: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
