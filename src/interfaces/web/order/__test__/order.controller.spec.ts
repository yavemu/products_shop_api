import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderController } from '../order.controller';
import {
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  GetOrdersUseCase,
} from '../../../../core/application/orders/use-cases';
import { Order } from '../../../../core/domain/orders/entities/order.entity';
import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm-entity';

describe('OrderController', () => {
  let controller: OrderController;
  let getOrders: jest.Mocked<GetOrdersUseCase>;
  let createOrder: jest.Mocked<CreateOrderUseCase>;
  let getOrderById: jest.Mocked<GetOrderByIdUseCase>;

  const mockOrder: Order = {
    id: 1,
    customerId: 1,
    deliveryId: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '123456789',
    totalAmount: 100,
    status: OrderStatusEnum.PENDING,
    orderDetails: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    getOrders = {
      execute: jest.fn().mockResolvedValue([mockOrder]),
    };

    createOrder = {
      execute: jest.fn().mockResolvedValue(mockOrder),
    };

    getOrderById = {
      execute: jest
        .fn()
        .mockImplementation((id: number) =>
          Promise.resolve({ ...mockOrder, id }),
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: GetOrdersUseCase,
          useValue: getOrders,
        },
        {
          provide: CreateOrderUseCase,
          useValue: createOrder,
        },
        {
          provide: GetOrderByIdUseCase,
          useValue: getOrderById,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['getOrders']).toBeDefined();
    expect(controller['createOrder']).toBeDefined();
    expect(controller['getOrderById']).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array of orders', async () => {
      const result = await controller.getAll();

      expect(result).toEqual([mockOrder]);
      expect(getOrders.execute).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no orders exist', async () => {
      getOrders.execute.mockResolvedValueOnce([]);

      const result = await controller.getAll();
      expect(result).toEqual([]);
    });

    it('should propagate error from use case', async () => {
      getOrders.execute.mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById()', () => {
    it('should return a single order', async () => {
      const orderId = 1;
      const result = await controller.getById(orderId);

      expect(result).toEqual({ ...mockOrder, id: orderId });
      expect(getOrderById.execute).toHaveBeenCalledWith(orderId);
    });

    it('should call use case with provided id', async () => {
      const orderId = 5;
      await controller.getById(orderId);

      expect(getOrderById.execute).toHaveBeenCalledWith(orderId);
    });

    it('should propagate error from use case', async () => {
      const orderId = 999;
      getOrderById.execute.mockRejectedValueOnce(new Error('Order not found'));

      await expect(controller.getById(orderId)).rejects.toThrow(
        'Order not found',
      );
    });

    it('should validate id parameter is a number', async () => {
      const orderId = 10;
      await controller.getById(orderId);

      expect(getOrderById.execute).toHaveBeenCalledWith(orderId);
    });
  });

  describe('create()', () => {
    const validCreateDto = {
      customerId: 1,
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      customerPhone: '123456789',
      deliveryId: 1,
      shippingAddress: '456 Oak Ave',
      products: [{ id: 1, quantity: 3 }],
    };

    it('should create a new order', async () => {
      const result = await controller.create(validCreateDto);

      expect(result).toEqual(mockOrder);
      expect(createOrder.execute).toHaveBeenCalledWith(validCreateDto);
    });

    it('should propagate exceptions from use case', async () => {
      createOrder.execute.mockRejectedValueOnce(new BadRequestException('Stock insuficiente'));

      await expect(controller.create(validCreateDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should propagate other errors from use case', async () => {
      createOrder.execute.mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(controller.create(validCreateDto)).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('should pass the DTO directly to use case', async () => {
      const customDto = {
        ...validCreateDto,
        customerPhone: '+1234567890',
      };

      await controller.create(customDto);

      expect(createOrder.execute).toHaveBeenCalledWith(customDto);
    });
  });
});
