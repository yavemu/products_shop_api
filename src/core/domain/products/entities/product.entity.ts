import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
  MaxLength,
  IsUrl,
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
}
