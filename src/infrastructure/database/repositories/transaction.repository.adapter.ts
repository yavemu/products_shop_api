import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { TransactionRepositoryPort } from '../../../core/domain/transactions/ports/transaction-repository.port';
import { Transaction } from '../../../core/domain/transactions/entities/transaction.entity';

@Injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: Partial<Transaction>): Promise<Transaction> {
    const entity = this.repository.create(transaction);
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.repository.findOne({ where: { id } });
  }
}
