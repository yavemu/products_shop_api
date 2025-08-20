import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

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
}
