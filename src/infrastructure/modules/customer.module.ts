import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrmEntity } from '../database/entities/customer.orm.entity';
import { CustomerRepositoryAdapter } from '../database/repositories/customer.repository.adapter';
import { CUSTOMER_REPOSITORY } from '../../core/domain/customers/ports/customer-repository.port';
import {
  CreateCustomerUseCase,
  GetCustomerByEmailUseCase,
} from '../../core/application/customers/use-cases';
import { CustomerController } from '../../interfaces/web/customer/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  exports: [CreateCustomerUseCase, GetCustomerByEmailUseCase],
  controllers: [CustomerController],
  providers: [
    CustomerRepositoryAdapter,
    CreateCustomerUseCase,
    GetCustomerByEmailUseCase,
    {
      provide: CUSTOMER_REPOSITORY,
      useExisting: CustomerRepositoryAdapter,
    },
  ],
})
export class CustomerModule {}
