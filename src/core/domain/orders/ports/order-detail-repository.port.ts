import { OrderDetail } from '../entities/order-detail.entity';

export const ORDER_DETAIL_REPOSITORY = 'ORDER_DETAIL_REPOSITORY';

export interface OrderDetailRepositoryPort {
  save(
    orderDetail: OrderDetail | OrderDetail[],
  ): Promise<OrderDetail | OrderDetail[]>;
  findById(id: number): Promise<OrderDetail | null>;
  findAll(): Promise<OrderDetail[]>;
}
