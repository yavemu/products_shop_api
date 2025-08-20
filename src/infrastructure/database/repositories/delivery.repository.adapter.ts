import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '../../../core/domain/deliveries/entities/delivery.entity';
import { DeliveryRepositoryPort } from '../../../core/domain/deliveries/ports/delivery-repository.port';
import { DeliveryOrmEntity } from '../entities/delivery.orm.entity';

@Injectable()
export class DeliveryRepositoryAdapter implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly repository: Repository<DeliveryOrmEntity>,
  ) {}

  async create(delivery: Delivery): Promise<Delivery> {
    const deliveryEntity = this.repository.create(delivery);
    const savedDelivery = await this.repository.save(deliveryEntity);
    return this.mapToDomain(savedDelivery);
  }

  private mapToDomain(ormEntity: DeliveryOrmEntity): Delivery {
    const delivery = new Delivery();
    delivery.id = ormEntity.id;
    delivery.trackingNumber = ormEntity.trackingNumber;
    delivery.deliveryAddress = ormEntity.deliveryAddress;
    delivery.deliveryFee = ormEntity.deliveryFee;
    delivery.status = ormEntity.status;
    return delivery;
  }
}
