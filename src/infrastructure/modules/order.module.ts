import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../../interfaces/web/order/order.controller';
import { OrderOrmEntity } from '../database/entities/order.orm-entity';

import { ProductOrmEntity } from '../database/entities/product.orm-entity';
import { OrderRepositoryAdapter } from '../database/repositories/order.repository.adapter';
import { OrderDetailRepositoryAdapter } from '../database/repositories/order-detail.repository.adapter';
import { ProductRepositoryAdapter } from '../database/repositories/product.repository.adapter';
import { ORDER_REPOSITORY } from '../../core/domain/orders/ports/order-repository.port';
import { ORDER_DETAIL_REPOSITORY } from '../../core/domain/orders/ports/order-detail-repository.port';
import { PRODUCT_REPOSITORY } from '../../core/domain/products/ports/product-repository.port';
import {
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  GetOrdersUseCase,
} from '../../core/application/orders/use-cases';
import { OrderDetailOrmEntity } from '../database/entities/order-detail.orm.entity';
import { CustomerModule } from './customer.module';
import { DeliveryModule } from './delivery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderDetailOrmEntity,
      ProductOrmEntity,
    ]),
    CustomerModule,
    DeliveryModule,
  ],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryAdapter },
    {
      provide: ORDER_DETAIL_REPOSITORY,
      useClass: OrderDetailRepositoryAdapter,
    },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryAdapter },
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersUseCase,
  ],
  exports: [ORDER_REPOSITORY, ORDER_DETAIL_REPOSITORY],
})
export class OrderModule {}
