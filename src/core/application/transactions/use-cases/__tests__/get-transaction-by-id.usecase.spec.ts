import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionByIdUseCase } from '../get-transaction-by-id.usecase';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
} from '../../../../domain/transactions/ports/transaction-repository.port';
import { Transaction } from '../../../../domain/transactions/entities/transaction.entity';

describe('GetTransactionByIdUseCase', () => {
  let useCase: GetTransactionByIdUseCase;
  let repository: jest.Mocked<TransactionRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionByIdUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetTransactionByIdUseCase>(GetTransactionByIdUseCase);
    repository = module.get(TRANSACTION_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return a transaction when found', async () => {
    const transaction: Transaction = {
      id: 1,
      amount: 500,
      description: 'Payment test',
      status: 'completed',
    } as Transaction;

    repository.findById.mockResolvedValue(transaction);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(transaction);
  });

  it('should return null when transaction is not found', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });

  it('should throw if repository.findById fails', async () => {
    repository.findById.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(1)).rejects.toThrow('DB error');
    expect(repository.findById).toHaveBeenCalledWith(1);
  });
});
