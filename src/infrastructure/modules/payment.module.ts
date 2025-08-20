import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from '../database/entities/order.orm.entity';
import { TransactionModule } from './transaction.module';
import { OrderModule } from './order.module';
import { PaymentController } from '../../interfaces/web/payment/payment.controller';
import { PayOrderUseCase } from '../../core/application/payments/payment-order.usecase';
import { WompiModule } from '../external_apis/wompi/wompi.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity]),
    TransactionModule,
    OrderModule,
    WompiModule,
  ],
  controllers: [PaymentController],
  providers: [PayOrderUseCase],
  exports: [PayOrderUseCase],
})
export class PaymentModule {}
