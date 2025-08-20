import { Controller, Post, Body } from '@nestjs/common';
import { CreateDeliveryUseCase } from '../../../core/application/deliveries/use-cases';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Delivery } from '../../../core/domain/deliveries/entities/delivery.entity';
import { CreateDeliverySwaggerDecorator } from '../../../commons/decorators';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly createDelivery: CreateDeliveryUseCase) {}

  @Post()
  @CreateDeliverySwaggerDecorator()
  async create(
    @Body() createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    return this.createDelivery.execute(createDeliveryDto);
  }
}
