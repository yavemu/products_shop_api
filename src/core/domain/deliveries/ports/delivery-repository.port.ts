import { Delivery } from '../entities/delivery.entity';

export const DELIVERY_REPOSITORY = 'DELIVERY_REPOSITORY';

export interface DeliveryRepositoryPort {
  create(delivery: Delivery): Promise<Delivery>;
  findById(id: number): Promise<Delivery | null>;
  update(id: number, delivery: Partial<Delivery>): Promise<Delivery>;
}
