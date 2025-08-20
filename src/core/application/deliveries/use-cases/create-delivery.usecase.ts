import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '../../../domain/deliveries/entities/delivery.entity';
import { DELIVERY_REPOSITORY } from '../../../domain/deliveries/ports/delivery-repository.port';
import type { DeliveryRepositoryPort } from '../../../domain/deliveries/ports/delivery-repository.port';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly repository: DeliveryRepositoryPort,
  ) {}

  async execute(data: Delivery): Promise<Delivery> {
    return this.repository.create(data);
  }
}
