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

  async findById(id: number): Promise<Delivery | null> {
    const delivery = await this.repository.findOne({
      where: { id },
    });
    return delivery ? this.mapToDomain(delivery) : null;
  }

  async update(id: number, delivery: Partial<Delivery>): Promise<Delivery> {
    await this.repository.update(id, delivery);
    const updatedDelivery = await this.repository.findOne({
      where: { id },
    });
    if (!updatedDelivery) {
      throw new Error('Delivery not found');
    }
    return this.mapToDomain(updatedDelivery);
  }

  private mapToDomain(ormEntity: DeliveryOrmEntity): Delivery {
    const delivery = new Delivery();
    delivery.id = ormEntity.id;
    delivery.name = ormEntity.name;
    delivery.trackingNumber = ormEntity.trackingNumber;
    delivery.shippingAddress = ormEntity.shippingAddress;
    delivery.fee = ormEntity.fee;
    delivery.status = ormEntity.status;
    return delivery;
  }
}
