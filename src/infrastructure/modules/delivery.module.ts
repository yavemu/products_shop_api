import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrmEntity } from '../database/entities/delivery.orm.entity';
import { DeliveryRepositoryAdapter } from '../database/repositories/delivery.repository.adapter';
import { DELIVERY_REPOSITORY } from '../../core/domain/deliveries/ports/delivery-repository.port';
import { CreateDeliveryUseCase } from '../../core/application/deliveries/use-cases';
import { DeliveryController } from '../../interfaces/web/delivery/delivery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrmEntity])],
  exports: [CreateDeliveryUseCase],
  controllers: [DeliveryController],
  providers: [
    DeliveryRepositoryAdapter,
    CreateDeliveryUseCase,
    {
      provide: DELIVERY_REPOSITORY,
      useExisting: DeliveryRepositoryAdapter,
    },
  ],
})
export class DeliveryModule {}
