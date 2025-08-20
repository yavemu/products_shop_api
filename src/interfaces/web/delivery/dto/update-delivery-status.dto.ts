import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatusEnum } from '../../../../core/domain/deliveries/entities/delivery.entity';

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    description: 'New delivery status',
    enum: DeliveryStatusEnum,
  })
  @IsEnum(DeliveryStatusEnum)
  status: DeliveryStatusEnum;
}
