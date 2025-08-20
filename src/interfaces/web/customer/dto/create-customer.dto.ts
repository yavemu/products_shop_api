import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer full name',
    example: 'Juan Pérez',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'juan.perez@email.com',
    format: 'email',
    maxLength: 100,
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+57 300 123 4567',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;
}
