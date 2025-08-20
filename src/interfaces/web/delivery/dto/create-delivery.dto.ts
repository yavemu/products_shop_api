import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatusEnum } from '../../../../core/domain/deliveries/enums/delivery-status.enum';

export class CreateDeliveryDto {
  @ApiProperty({
    description: 'Delivery name',
    example: 'Express Delivery',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Tracking number from carrier',
    example: 'DHL123456789',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  trackingNumber: string;

  @ApiProperty({
    description: 'Complete shipping address',
    example: 'Calle 123, Medellín, Colombia',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shippingAddress: string;

  @ApiProperty({
    description: 'Fee amount',
    example: 15000,
  })
  @IsNumber()
  @IsPositive()
  fee: number;

  @ApiProperty({
    description: 'Delivery status',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.PENDING,
  })
  @IsEnum(DeliveryStatusEnum)
  status: DeliveryStatusEnum;
}
