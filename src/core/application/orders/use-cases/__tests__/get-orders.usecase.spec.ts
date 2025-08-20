import { Test, TestingModule } from '@nestjs/testing';
import { GetOrdersUseCase } from '../get-orders.usecase';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../../../../core/domain/orders/ports/order-repository.port';
import { Order } from '../../../../../core/domain/orders/entities/order.entity';
import { OrderStatusEnum } from '../../../../../infrastructure/database/entities/order.orm.entity';
import { OrderDetail } from '../../../../../core/domain/orders/entities/order-detail.entity';

const OrdersMocks: Order[] = [
  {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '3001234567',
    shippingAddress: '123 Main St, Medellín',
    totalAmount: 250.5,
    status: OrderStatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderDetails: [
      {
        id: 1,
        productId: 101,
        quantity: 2,
        price: 125.25,
      } as OrderDetail,
    ],
  } as Order,
  {
    id: 2,
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    shippingAddress: '456 Elm St, Bogotá',
    totalAmount: 500,
    status: OrderStatusEnum.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderDetails: [
      {
        id: 2,
        productId: 202,
        quantity: 5,
        price: 100,
      } as OrderDetail,
    ],
  } as Order,
];
describe('GetOrdersUseCase', () => {
  let useCase: GetOrdersUseCase;
  let repository: jest.Mocked<OrderRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrdersUseCase,
        {
          provide: ORDER_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetOrdersUseCase>(GetOrdersUseCase);
    repository = module.get(ORDER_REPOSITORY);
  });

  it('should return all orders', async () => {
    repository.findAll.mockResolvedValue(OrdersMocks);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(OrdersMocks);
  });

  it('should return an empty array if no orders exist', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate error if repository.findAll fails', async () => {
    repository.findAll.mockRejectedValue(new Error('DB Error'));

    await expect(useCase.execute()).rejects.toThrow('DB Error');
  });
});
