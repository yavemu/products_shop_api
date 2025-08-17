import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../../core/domain/orders/entities/order.entity';
import { OrderRepositoryPort } from '../../../core/domain/orders/ports/order-repository.port';
import { OrderOrmEntity } from '../entities/order.orm-entity';

@Injectable()
export class OrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async save(order: Order): Promise<Order> {
    const entity = this.repository.create(order);
    const saved = await this.repository.save(entity);
    return saved;
  }
  async findById(id: number): Promise<Order | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find();
  }
}
