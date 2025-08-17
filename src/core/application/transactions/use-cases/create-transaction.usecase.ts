import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '../../../domain/transactions/entities/transaction.entity';
import { TRANSACTION_REPOSITORY } from '../../../domain/transactions/ports/transaction-repository.port';
import type { TransactionRepositoryPort } from '../../../domain/transactions/ports/transaction-repository.port';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepositoryPort,
  ) {}

  async execute(data: Transaction): Promise<Transaction> {
    return this.repository.save(data);
  }
}
