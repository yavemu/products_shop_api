import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '../../../domain/transactions/entities/transaction.entity';
import { TRANSACTION_REPOSITORY } from '../../../domain/transactions/ports/transaction-repository.port';
import type { TransactionRepositoryPort } from '../../../domain/transactions/ports/transaction-repository.port';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepositoryPort,
  ) {}

  async execute(id: number): Promise<Transaction | null> {
    return this.repository.findById(id);
  }
}
