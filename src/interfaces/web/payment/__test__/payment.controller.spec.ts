import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../payment.controller';
import { PayOrderUseCase } from '../../../../core/application/payments/payment-order.usecase';
import { PayOrderDto } from '../dto/pay-oder.dto';
import { Transaction } from '../../../../core/domain/transactions/entities/transaction.entity';
import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm-entity';

const TransactionMock: Transaction = {
  id: 1,
  orderId: 123,
  status: OrderStatusEnum.CONFIRMED,
  providerName: 'WOMPI',
  providerTransactionId: 'txn_12345',
  providerStatus: 'APPROVED',
  providerStatusMessage: 'Transaction approved',
  providerAmountInCents: '100000',
  providerCurrency: 'COP',
  providerReference: '123_1640995200000',
  providerCustomerEmail: 'test@example.com',
  providerPaymentMethodType: 'CARD',
  providerCardBrand: 'VISA',
  providerCardLastFour: '1234',
  createdAt: new Date('2024-01-15T10:30:00.000Z'),
  updatedAt: new Date('2024-01-15T10:30:00.000Z'),
};

const PayOrderDtoMock: PayOrderDto = {
  cardNumber: '4111111111111111',
  expMonth: '12',
  expYear: '25',
  cvc: '123',
  cardHolder: 'John Doe',
  installments: 1,
  deliveryAmount: 5000,
  deliveryName: 'Express Delivery',
};

describe('PaymentController', () => {
  let controller: PaymentController;
  let payOrder: jest.Mocked<PayOrderUseCase>;

  beforeEach(async () => {
    payOrder = {
      execute: jest.fn().mockResolvedValue(TransactionMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PayOrderUseCase,
          useValue: payOrder,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['payOrder']).toBeDefined();
  });

  describe('doOrderPayment', () => {
    it('should process payment and return transaction', async () => {
      const orderId = 123;
      const result = await controller.doOrderPayment(orderId, PayOrderDtoMock);

      expect(result).toEqual(TransactionMock);
      expect(payOrder.execute).toHaveBeenCalledTimes(1);
      expect(payOrder.execute).toHaveBeenCalledWith({
        orderId,
        ...PayOrderDtoMock,
      });
    });

    it('should call use case with correct parameters', async () => {
      const orderId = 456;
      const customDto = {
        ...PayOrderDtoMock,
        cardHolder: 'Jane Smith',
        installments: 3,
      };

      await controller.doOrderPayment(orderId, customDto);

      expect(payOrder.execute).toHaveBeenCalledWith({
        orderId,
        ...customDto,
      });
    });

    it('should handle different order IDs', async () => {
      const orderIds = [1, 100, 999];

      for (const orderId of orderIds) {
        await controller.doOrderPayment(orderId, PayOrderDtoMock);
        expect(payOrder.execute).toHaveBeenCalledWith({
          orderId,
          ...PayOrderDtoMock,
        });
      }

      expect(payOrder.execute).toHaveBeenCalledTimes(orderIds.length);
    });

    it('should throw if use case throws', async () => {
      payOrder.execute.mockRejectedValueOnce(new Error('Order not found'));

      await expect(
        controller.doOrderPayment(999, PayOrderDtoMock),
      ).rejects.toThrow('Order not found');
    });

    it('should handle payment processing errors', async () => {
      payOrder.execute.mockRejectedValueOnce(
        new Error('Payment provider error'),
      );

      await expect(
        controller.doOrderPayment(123, PayOrderDtoMock),
      ).rejects.toThrow('Payment provider error');
    });

    it('should validate transaction response structure', async () => {
      const orderId = 123;
      const result = await controller.doOrderPayment(orderId, PayOrderDtoMock);

      expect(result).toMatchObject({
        id: expect.any(Number) as number,
        orderId: expect.any(Number) as number,
        status: expect.any(String) as OrderStatusEnum,
        providerName: expect.any(String) as string,
        providerTransactionId: expect.any(String) as string,
        providerStatus: expect.any(String) as string,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });

    it('should handle different payment methods', async () => {
      const differentCards = [
        { ...PayOrderDtoMock, cardNumber: '5555555555554444' },
        { ...PayOrderDtoMock, cardNumber: '378282246310005' },
      ];

      for (const cardDto of differentCards) {
        await controller.doOrderPayment(123, cardDto);
        expect(payOrder.execute).toHaveBeenCalledWith({
          orderId: 123,
          ...cardDto,
        });
      }
    });

    it('should handle installments correctly', async () => {
      const installmentOptions = [1, 3, 6, 12];

      for (const installments of installmentOptions) {
        const dtoWithInstallments = { ...PayOrderDtoMock, installments };
        await controller.doOrderPayment(123, dtoWithInstallments);

        expect(payOrder.execute).toHaveBeenCalledWith({
          orderId: 123,
          ...dtoWithInstallments,
        });
      }
    });

    it('should handle optional delivery fields', async () => {
      const dtoWithoutDelivery = {
        cardNumber: '4111111111111111',
        expMonth: '12',
        expYear: '25',
        cvc: '123',
        cardHolder: 'John Doe',
        installments: 1,
      };

      await controller.doOrderPayment(123, dtoWithoutDelivery as PayOrderDto);

      expect(payOrder.execute).toHaveBeenCalledWith({
        orderId: 123,
        ...dtoWithoutDelivery,
      });
    });
  });
});
