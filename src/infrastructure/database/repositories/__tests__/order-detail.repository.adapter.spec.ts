import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetailOrmEntity } from '../../entities/order-detail.orm.entity';
import { OrderDetail } from '../../../../core/domain/orders/entities/order-detail.entity';
import { OrderDetailRepositoryAdapter } from '../order-detail.repository.adapter';

describe('OrderDetailRepositoryAdapter', () => {
  let repositoryAdapter: OrderDetailRepositoryAdapter;
  let repository: Repository<OrderDetailOrmEntity>;

  const mockOrderDetail: OrderDetail = {
    id: 1,
    productId: 101,
    orderId: 200,
    quantity: 2,
    price: 50,
  } as OrderDetail;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailRepositoryAdapter,
        {
          provide: getRepositoryToken(OrderDetailOrmEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repositoryAdapter = module.get<OrderDetailRepositoryAdapter>(
      OrderDetailRepositoryAdapter,
    );
    repository = module.get<Repository<OrderDetailOrmEntity>>(
      getRepositoryToken(OrderDetailOrmEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save an OrderDetail', async () => {
      mockRepository.create.mockReturnValue(mockOrderDetail);
      mockRepository.save.mockResolvedValue(mockOrderDetail);

      const result = await repositoryAdapter.save(mockOrderDetail);

      expect(mockRepository.create).toHaveBeenCalledWith(mockOrderDetail);
      expect(mockRepository.save).toHaveBeenCalledWith(mockOrderDetail);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  describe('findById', () => {
    it('should return an OrderDetail by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockOrderDetail);

      const result = await repositoryAdapter.findById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrderDetail);
    });

    it('should return null if OrderDetail is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repositoryAdapter.findById(99);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 99 },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all OrderDetails', async () => {
      const mockList = [mockOrderDetail];
      mockRepository.find.mockResolvedValue(mockList);

      const result = await repositoryAdapter.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });
  });
});
