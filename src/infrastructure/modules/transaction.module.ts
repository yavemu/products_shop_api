import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../database/entities/transaction.orm-entity';
import { TransactionRepositoryAdapter } from '../database/repositories/transaction.repository.adapter';
import { TRANSACTION_REPOSITORY } from '../../core/domain/transactions/ports/transaction-repository.port';
import {
  CreateTransactionUseCase,
  GetTransactionByIdUseCase,
} from '../../core/application/transactions/use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity])],
  controllers: [],
  providers: [
    TransactionRepositoryAdapter,
    CreateTransactionUseCase,
    GetTransactionByIdUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useExisting: TransactionRepositoryAdapter,
    },
  ],
  exports: [
    CreateTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useExisting: TransactionRepositoryAdapter,
    },
    TypeOrmModule,
  ],
})
export class TransactionModule {}
