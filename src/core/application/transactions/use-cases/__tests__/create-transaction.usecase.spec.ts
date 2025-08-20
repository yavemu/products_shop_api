import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../create-transaction.usecase';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
} from '../../../../domain/transactions/ports/transaction-repository.port';
import { Transaction } from '../../../../domain/transactions/entities/transaction.entity';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: jest.Mocked<TransactionRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    repository = module.get(TRANSACTION_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should create a transaction successfully', async () => {
    const transaction: Transaction = {
      id: 1,
      amount: 1000,
      description: 'Test transaction',
      status: 'pending',
    } as Transaction;

    repository.save.mockResolvedValue(transaction);

    const result = await useCase.execute(transaction);

    expect(repository.save).toHaveBeenCalledWith(transaction);
    expect(result).toEqual(transaction);
  });

  it('should throw if repository.save fails', async () => {
    const transaction = { id: 2, amount: 500 } as Transaction;

    repository.save.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(transaction)).rejects.toThrow('DB error');
    expect(repository.save).toHaveBeenCalledWith(transaction);
  });
});
