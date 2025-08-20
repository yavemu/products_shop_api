import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderUseCase } from '../create-order.usecase';
import { ORDER_REPOSITORY } from '../../../../domain/orders/ports/order-repository.port';
import { PRODUCT_REPOSITORY } from '../../../../domain/products/ports/product-repository.port';
import { Order } from '../../../../domain/orders/entities/order.entity';
import { OrderDetail } from '../../../../domain/orders/entities/order-detail.entity';
import { OrderStatusEnum } from '../../../../../infrastructure/database/entities/order.orm.entity';
import { ICreateOrder } from '../../interfaces/create-order.interface';
import {
  CreateCustomerUseCase,
  GetCustomerByEmailUseCase,
} from '../../../customers/use-cases';
import {
  GetDeliveryByIdUseCase,
  UpdateDeliveryUseCase,
} from '../../../deliveries/use-cases';

const ProductsMock = [
  { id: 1, name: 'Product A', price: 100, stock: 10 },
  { id: 2, name: 'Product B', price: 200, stock: 5 },
];

const CreateOrderDtoMock: ICreateOrder = {
  customerId: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '123456789',
  deliveryId: 1,
  shippingAddress: '123 Main St',
  products: [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ],
};

const OrderMock: Order = {
  id: 1,
  customerId: 1,
  deliveryId: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '123456789',
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

const mockCreateCustomerUseCase = {
  execute: jest.fn(),
};

const mockGetCustomerByEmailUseCase = {
  execute: jest.fn(),
};

const mockGetDeliveryByIdUseCase = {
  execute: jest.fn(),
};

const mockUpdateDeliveryUseCase = {
  execute: jest.fn(),
};

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        { provide: ORDER_REPOSITORY, useValue: OrderMockRepository },
        { provide: PRODUCT_REPOSITORY, useValue: mockProductRepository },
        { provide: CreateCustomerUseCase, useValue: mockCreateCustomerUseCase },
        { provide: GetCustomerByEmailUseCase, useValue: mockGetCustomerByEmailUseCase },
        { provide: GetDeliveryByIdUseCase, useValue: mockGetDeliveryByIdUseCase },
        { provide: UpdateDeliveryUseCase, useValue: mockUpdateDeliveryUseCase },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);

    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    mockProductRepository.findAll.mockResolvedValue(ProductsMock);
    OrderMockRepository.save.mockResolvedValue(OrderMock);
    OrderMockRepository.findById.mockResolvedValue(OrderMock);
    mockGetCustomerByEmailUseCase.execute.mockResolvedValue(null);
    mockCreateCustomerUseCase.execute.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789' });
    mockGetDeliveryByIdUseCase.execute.mockResolvedValue({ id: 1, shippingAddress: '123 Main St' });
    mockUpdateDeliveryUseCase.execute.mockResolvedValue(undefined);

    const result = await useCase.execute(CreateOrderDtoMock);

    expect(mockProductRepository.findAll).toHaveBeenCalledWith({
      ids: [1, 2],
    });
    expect(mockGetCustomerByEmailUseCase.execute).toHaveBeenCalledWith('john@example.com');
    expect(mockCreateCustomerUseCase.execute).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
    });
    expect(mockGetDeliveryByIdUseCase.execute).toHaveBeenCalledWith(1);
    expect(OrderMockRepository.save).toHaveBeenCalled();
    expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
    expect(result).toEqual(OrderMock);
  });

  it('should throw BadRequestException if a product is missing', async () => {
    mockProductRepository.findAll.mockResolvedValue([ProductsMock[0]]);

    await expect(useCase.execute(CreateOrderDtoMock)).rejects.toThrow(
      new BadRequestException('Uno o varios productos no fueron encontrados'),
    );
  });

  it('should throw BadRequestException if delivery is not found', async () => {
    mockProductRepository.findAll.mockResolvedValue(ProductsMock);
    mockGetCustomerByEmailUseCase.execute.mockResolvedValue(null);
    mockCreateCustomerUseCase.execute.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789' });
    mockGetDeliveryByIdUseCase.execute.mockResolvedValue(null);

    await expect(useCase.execute(CreateOrderDtoMock)).rejects.toThrow(
      new BadRequestException('Delivery no encontrado'),
    );
  });

  it('should throw BadRequestException if stock is insufficient', async () => {
    const lowStockProduct = { ...ProductsMock[0], stock: 1 };
    mockProductRepository.findAll.mockResolvedValue([
      lowStockProduct,
      ProductsMock[1],
    ]);
    mockGetCustomerByEmailUseCase.execute.mockResolvedValue(null);
    mockCreateCustomerUseCase.execute.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789' });
    mockGetDeliveryByIdUseCase.execute.mockResolvedValue({ id: 1, shippingAddress: '123 Main St' });

    await expect(useCase.execute(CreateOrderDtoMock)).rejects.toThrow(
      new BadRequestException('Stock insuficiente para el producto Product A. Stock disponible: 1, cantidad solicitada: 2'),
    );
  });

  it('should throw InternalServerErrorException if the order cannot be saved', async () => {
    mockProductRepository.findAll.mockResolvedValue(ProductsMock);
    OrderMockRepository.save.mockResolvedValue(null);
    mockGetCustomerByEmailUseCase.execute.mockResolvedValue(null);
    mockCreateCustomerUseCase.execute.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789' });
    mockGetDeliveryByIdUseCase.execute.mockResolvedValue({ id: 1, shippingAddress: '123 Main St' });

    await expect(useCase.execute(CreateOrderDtoMock)).rejects.toThrow(
      new InternalServerErrorException('No se pudo guardar la orden'),
    );
  });
});
