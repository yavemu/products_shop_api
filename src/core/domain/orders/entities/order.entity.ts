import { IsInt, IsPositive, Min } from 'class-validator';

export class Order {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @IsPositive()
  price: number;
}
