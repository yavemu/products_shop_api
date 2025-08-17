import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class Transaction {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  orderId: number;
}
