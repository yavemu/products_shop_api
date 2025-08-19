import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '../create-order.usecase';
import { ORDER_REPOSITORY } from '../../../../domain/orders/ports/order-repository.port';
import { PRODUCT_REPOSITORY } from '../../../../domain/products/ports/product-repository.port';
import { Order } from '../../../../domain/orders/entities/order.entity';
import { OrderDetail } from '../../../../domain/orders/entities/order-detail.entity';
import { OrderStatusEnum } from '../../../../../infrastructure/database/entities/order.orm-entity';
import { ICreateOrder } from '../../interfaces/create-order.interface';

const ProductsMock = [
  { id: 1, name: 'Product A', price: 100, stock: 10 },
  { id: 2, name: 'Product B', price: 200, stock: 5 },
];

const CreateOrderDtoMock: ICreateOrder = {
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '123456789',
  shippingAddress: '123 Main St',
  products: [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ],
};

const OrderMock: Order = {
  id: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '123456789',
  shippingAddress: '123 Main St',
  totalAmount: 400,
  status: OrderStatusEnum.PENDING,
  orderDetails: [
    Object.assign(new OrderDetail(), {
      productId: 1,
      quantity: 2,
      unitPrice: 100,
      totalPrice: 200,
      orderId: 1,
    }),
    Object.assign(new OrderDetail(), {
      productId: 2,
      quantity: 1,
      unitPrice: 200,
      totalPrice: 200,
      orderId: 1,
    }),
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
} as Order;

const OrderMockRepository = {
  save: jest.fn(),
  findById: jest.fn(),
};

const mockProductRepository = {
  findAll: jest.fn(),
  save: jest.fn(),
};

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        { provide: ORDER_REPOSITORY, useValue: OrderMockRepository },
        { provide: PRODUCT_REPOSITORY, useValue: mockProductRepository },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);

    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    mockProductRepository.findAll.mockResolvedValue(ProductsMock);
    OrderMockRepository.save.mockResolvedValue(OrderMock);
    OrderMockRepository.findById.mockResolvedValue(OrderMock);

    const result = await useCase.execute(CreateOrderDtoMock);

    expect(mockProductRepository.findAll).toHaveBeenCalledWith({
      ids: [1, 2],
    });
    expect(OrderMockRepository.save).toHaveBeenCalled();
    expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
    expect(result).toEqual(OrderMock);
  });

  it('should throw an error if a product is missing', async () => {
    mockProductRepository.findAll.mockResolvedValue([ProductsMock[0]]);

    await expect(useCase.execute(CreateOrderDtoMock)).rejects.toThrow(
      'Uno o varios productos no fueron encontrados',
    );
  });

  it('should return null if stock is insufficient', async () => {
    const lowStockProduct = { ...ProductsMock[0], stock: 1 };
    mockProductRepository.findAll.mockResolvedValue([
      lowStockProduct,
      ProductsMock[1],
    ]);

    const result = await useCase.execute(CreateOrderDtoMock);

    expect(result).toBeNull();
  });

  it('should throw an error if the order cannot be saved', async () => {
    mockProductRepository.findAll.mockResolvedValue(ProductsMock);
    OrderMockRepository.save.mockResolvedValue(null);

    await expect(useCase.execute(CreateOrderDtoMock)).rejects.toThrow(
      'No se pudo guardar la orden',
    );
  });
});
