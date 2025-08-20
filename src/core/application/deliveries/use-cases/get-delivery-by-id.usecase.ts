import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '../../../domain/deliveries/entities/delivery.entity';
import { DELIVERY_REPOSITORY } from '../../../domain/deliveries/ports/delivery-repository.port';
import type { DeliveryRepositoryPort } from '../../../domain/deliveries/ports/delivery-repository.port';

@Injectable()
export class GetDeliveryByIdUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly repository: DeliveryRepositoryPort,
  ) {}

  async execute(id: number): Promise<Delivery | null> {
    return this.repository.findById(id);
  }
}