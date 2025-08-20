import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderOrmEntity } from '../../entities/order.orm-entity';
import { Order } from '../../../../core/domain/orders/entities/order.entity';
import { OrderRepositoryAdapter } from '../order.repository.adapter';

describe('OrderRepositoryAdapter', () => {
  let repository: Repository<OrderOrmEntity>;
  let adapter: OrderRepositoryAdapter;

  const mockOrder: Order = {
    id: 1,
    customerName: 'John Doe',
    total: 100,
  } as Order;

  const repositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryAdapter,
        {
          provide: getRepositoryToken(OrderOrmEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    adapter = module.get<OrderRepositoryAdapter>(OrderRepositoryAdapter);
    repository = module.get<Repository<OrderOrmEntity>>(
      getRepositoryToken(OrderOrmEntity),
    );

    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should create and save an order', async () => {
      repositoryMock.create.mockReturnValue(mockOrder);
      repositoryMock.save.mockResolvedValue(mockOrder);

      const result = await adapter.save(mockOrder);

      expect(repositoryMock.create).toHaveBeenCalledWith(mockOrder);
      expect(repositoryMock.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findById', () => {
    it('should return an order if found', async () => {
      repositoryMock.findOne.mockResolvedValue(mockOrder);

      const result = await adapter.findById(1);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrder);
    });

    it('should return null if not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      const result = await adapter.findById(2);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      repositoryMock.find.mockResolvedValue([mockOrder]);

      const result = await adapter.findAll();

      expect(repositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual([mockOrder]);
    });

    it('should return empty array if no orders exist', async () => {
      repositoryMock.find.mockResolvedValue([]);

      const result = await adapter.findAll();

      expect(repositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
