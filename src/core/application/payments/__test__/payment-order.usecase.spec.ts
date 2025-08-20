import { Test, TestingModule } from '@nestjs/testing';
import { PayOrderUseCase } from '../payment-order.usecase';
import { WompiService } from '../../../../infrastructure/external_apis/wompi/wompi.service';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
} from '../../../../core/domain/transactions/ports/transaction-repository.port';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../../../core/domain/orders/ports/order-repository.port';
import { NotFoundException } from '@nestjs/common';
import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm-entity';
import { Transaction } from '../../../../core/domain/transactions/entities/transaction.entity';
import { Order } from '../../../../core/domain/orders/entities/order.entity';

describe('PayOrderUseCase', () => {
  let useCase: PayOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepositoryPort>;
  let transactionRepository: jest.Mocked<TransactionRepositoryPort>;
  let wompiService: jest.Mocked<WompiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayOrderUseCase,
        {
          provide: ORDER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: WompiService,
          useValue: {
            createPayWithCreditCardTransaction: jest.fn(),
            pollTransactionStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<PayOrderUseCase>(PayOrderUseCase);
    orderRepository = module.get(ORDER_REPOSITORY);
    transactionRepository = module.get(TRANSACTION_REPOSITORY);
    wompiService = module.get(WompiService);
  });

  const mockInput = {
    orderId: 'order-123',
    cardNumber: '4111111111111111',
    expMonth: '12',
    expYear: '2030',
    cvc: '123',
    installments: 1,
    cardHolder: 'John Doe',
  };

  const mockOrder: Order = {
    id: 'order-123',
    status: OrderStatusEnum.PENDING,
    totalAmount: 10000,
    customerEmail: 'test@test.com',
    transactions: [],
  } as Order;

  const mockTransaction: Transaction = {
    id: 'tx-1',
    orderId: 'order-123',
    status: OrderStatusEnum.PENDING,
  } as Transaction;

  const mockWompiResponse = {
    transaction: {
      id: 'wompi-tx-1',
      status: 'PENDING',
      status_message: 'Pending confirmation',
      amount_in_cents: 10000,
      currency: 'COP',
      reference: 'ref-123',
      customer_email: 'test@test.com',
      payment_method_type: 'CARD',
      created_at: 'now',
    },
    transactionInfo: {
      payment_method: {
        type: 'CARD',
        installments: 1,
        extra: { brand: 'VISA', name: 'John', last_four: '1111' },
      },
    },
    merchantInfo: {
      id: 'merchant-1',
      name: 'Wompi',
    },
  };

  const mockPollingResponse = {
    status: 'APPROVED',
    status_message: 'Approved',
  };

  it('should throw NotFoundException if order not found', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(mockInput)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if order is not PENDING', async () => {
    const nonPendingOrder = { ...mockOrder, status: OrderStatusEnum.CONFIRMED };
    orderRepository.findById.mockResolvedValue(nonPendingOrder);

    await expect(useCase.execute(mockInput)).rejects.toThrow(NotFoundException);
  });

  it('should execute full pay order flow successfully', async () => {
    orderRepository.findById.mockResolvedValue({ ...mockOrder });
    transactionRepository.save.mockImplementation(async (tx) => ({
      ...mockTransaction,
      ...tx,
    }));
    orderRepository.save.mockImplementation(async (order) => order);
    wompiService.createPayWithCreditCardTransaction.mockResolvedValue(
      mockWompiResponse as any,
    );
    wompiService.pollTransactionStatus.mockResolvedValue(
      mockPollingResponse as any,
    );

    const result = await useCase.execute(mockInput);

    expect(orderRepository.findById).toHaveBeenCalledWith(mockInput.orderId);
    expect(transactionRepository.save).toHaveBeenCalled();
    expect(wompiService.createPayWithCreditCardTransaction).toHaveBeenCalled();
    expect(wompiService.pollTransactionStatus).toHaveBeenCalled();
    expect(result.status).toBe(OrderStatusEnum.CONFIRMED);
  });
});
