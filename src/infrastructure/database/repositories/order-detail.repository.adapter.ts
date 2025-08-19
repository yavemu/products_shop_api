import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetailRepositoryPort } from '../../../core/domain/orders/ports/order-detail-repository.port';
import { OrderDetailOrmEntity } from '../entities/order-detail.orm.entity';
import { OrderDetail } from '../../../core/domain/orders/entities/order-detail.entity';

@Injectable()
export class OrderDetailRepositoryAdapter implements OrderDetailRepositoryPort {
  constructor(
    @InjectRepository(OrderDetailOrmEntity)
    private readonly repository: Repository<OrderDetailOrmEntity>,
  ) {}

  async save(orderDetail: OrderDetail): Promise<OrderDetail> {
    const entity = this.repository.create(orderDetail);
    const saved = await this.repository.save(entity);
    return saved;
  }
  async findById(id: number): Promise<OrderDetail | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.repository.find();
  }
}
