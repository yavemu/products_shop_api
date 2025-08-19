import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProducts {
  @ApiProperty({
    description: 'Product ID of the item being ordered',
    example: 1,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Quantity of the selected product',
    example: 2,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer full name',
    example: 'Juan Pérez',
    maxLength: 100,
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'juan.perez@email.com',
    format: 'email',
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+57 300 123 4567',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    description: 'Complete shipping address',
    example: 'Calle 123, Medellin, Colombia',
  })
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'List of products ordered',
    type: [OrderProducts],
    minItems: 1,
    example: [
      { id: 1, quantity: 2 },
      { id: 3, quantity: 1 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one order detail is required' })
  @ValidateNested({ each: true })
  @Type(() => OrderProducts)
  products: OrderProducts[];
}
