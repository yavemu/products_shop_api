// src/core/application/payments/payment-order.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatusEnum } from '../../../infrastructure/database/entities/order.orm-entity';
import { IPayOrderInput } from './interfaces/payment-order.interface';
import { Transaction } from '../../../core/domain/transactions/entities/transaction.entity';

import {
  ICreatePayWithCreditCardTransactionInput,
  ICreatePayWithCreditCardTransactionResponse,
} from '../../../infrastructure/external_apis/wompi/interfaces';

import { WompiService } from '../../../infrastructure/external_apis/wompi/wompi.service';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepositoryPort,
} from '../../../core/domain/transactions/ports/transaction-repository.port';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../../core/domain/orders/ports/order-repository.port';

@Injectable()
export class PayOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    private readonly wompiService: WompiService,
  ) {}

  async execute(input: IPayOrderInput): Promise<Transaction> {
    const { orderId } = input;

    // 1) Validar Orden PENDING
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(
        `No se encontro la orden ${orderId} pendiente`,
      );
    }

    if (order.status !== OrderStatusEnum.PENDING) {
      throw new NotFoundException(
        `La orden ${orderId} no se encuentra pendiente`,
      );
    }

    // 2) Crear transacción PENDING
    const transactionData = new Transaction();
    transactionData.orderId = orderId;
    transactionData.status = 'PENDING';
    const transaction = await this.transactionRepository.save(transactionData);

    // 3) Ejecutar flujo de pasarela con el proveedor
    const paymentProviderResponse: ICreatePayWithCreditCardTransactionResponse =
      await this.doPayWithCreditCardWompiFlow(input);

    const transactionUpdated = this.getPaymentDataToPersistInTansaction(
      transaction,
      paymentProviderResponse,
    );

    return await this.transactionRepository.save(transactionUpdated);
  }
  private async doPayWithCreditCardWompiFlow(
    input: ICreatePayWithCreditCardTransactionInput,
  ): Promise<ICreatePayWithCreditCardTransactionResponse> {
    const payWithCreditCardFlow =
      await this.wompiService.createPayWithCreditCardTransaction(input);
    return payWithCreditCardFlow;
  }

  private getPaymentDataToPersistInTansaction(
    createdTransaction: Transaction,
    paymentProviderResponse: ICreatePayWithCreditCardTransactionResponse,
  ): Transaction {
    const transaction = paymentProviderResponse.transaction;
    const pm = paymentProviderResponse.transactionInfo.payment_method;
    const pmExtra = pm?.extra ?? {};
    const merchant = paymentProviderResponse.merchantInfo;

    const toPersist = {
      providerName: 'WOMPI',
      providerTransactionId: transaction.id?.toString(),
      providerStatus: transaction.status?.toString(),
      providerStatusMessage:
        transaction.status_message?.toString() ?? undefined,
      providerAmountInCents: transaction.amount_in_cents?.toString(),
      providerCurrency: transaction.currency?.toString(),
      providerReference: transaction.reference?.toString(),
      providerCustomerEmail: transaction.customer_email?.toString(),
      providerPaymentMethodType: transaction.payment_method_type?.toString(),
      providerInstallments:
        pm?.installments != null ? pm.installments.toString() : undefined,
      providerCreatedAtProvider: transaction.created_at?.toString(),
      providerFinalizedAtProvider:
        transaction.finalized_at?.toString() ?? undefined,

      providerCardBrand: pmExtra?.brand?.toString(),
      providerCardNameMasked: pmExtra?.name?.toString(),
      providerCardLastFour: pmExtra?.last_four?.toString(),
      providerCardType: pm?.type?.toString(),

      providerMerchantId: merchant?.id?.toString(),
      providerMerchantName: merchant?.name?.toString(),

      providerRawResponse: JSON.stringify(paymentProviderResponse),
    } as Partial<Transaction>;

    const transactionToUpdate: Transaction = {
      ...toPersist,
      ...createdTransaction,
    };

    return transactionToUpdate;
  }
}
