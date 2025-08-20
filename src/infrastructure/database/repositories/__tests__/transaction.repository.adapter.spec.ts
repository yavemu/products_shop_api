import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepositoryAdapter } from '../transaction.repository.adapter';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../../entities/transaction.orm-entity';
import { Transaction } from '../../../../core/domain/transactions/entities/transaction.entity';

describe('TransactionRepositoryAdapter', () => {
  let repository: TransactionRepositoryAdapter;
  let ormRepository: jest.Mocked<Repository<TransactionOrmEntity>>;

  const transactionEntity: TransactionOrmEntity = {
    id: 1,
    amount: 100,
    description: 'Test Transaction',
    status: 'pending',
  } as TransactionOrmEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepositoryAdapter,
        {
          provide: getRepositoryToken(TransactionOrmEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionRepositoryAdapter>(
      TransactionRepositoryAdapter,
    );
    ormRepository = module.get(getRepositoryToken(TransactionOrmEntity));
  });

  describe('save', () => {
    it('should create and save a transaction', async () => {
      ormRepository.create.mockReturnValue(transactionEntity);
      ormRepository.save.mockResolvedValue(transactionEntity);

      const result = await repository.save(
        transactionEntity as unknown as Transaction,
      );

      expect(ormRepository.create).toHaveBeenCalledWith(transactionEntity);
      expect(ormRepository.save).toHaveBeenCalledWith(transactionEntity);
      expect(result).toEqual(expect.objectContaining({ id: 1, amount: 100 }));
    });
  });

  describe('findById', () => {
    it('should return a transaction when found', async () => {
      ormRepository.findOne.mockResolvedValue(transactionEntity);

      const result = await repository.findById(1);

      expect(ormRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(expect.objectContaining({ id: 1, amount: 100 }));
    });

    it('should return null when not found', async () => {
      ormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });
});
