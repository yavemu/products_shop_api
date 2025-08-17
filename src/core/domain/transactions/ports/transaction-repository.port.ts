import { Transaction } from '../entities/transaction.entity';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface TransactionRepositoryPort {
  save(product: Transaction): Promise<Transaction>;
  findById(id: number): Promise<Transaction | null>;
}
