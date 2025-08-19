import { IsInt, IsPositive, Min, IsNumber } from 'class-validator';

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
}
