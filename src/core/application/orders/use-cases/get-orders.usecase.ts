import { Injectable, Inject } from '@nestjs/common';
import { Order } from '../../../domain/orders/entities/order.entity';
import { ORDER_REPOSITORY } from '../../../domain/orders/ports/order-repository.port';
import type { OrderRepositoryPort } from '../../../domain/orders/ports/order-repository.port';

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryPort,
  ) {}

  async execute(): Promise<Order[]> {
    return this.repository.findAll();
  }
}
