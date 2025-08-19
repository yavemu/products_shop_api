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
import { Order } from '../../../core/domain/orders/entities/order.entity';

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

    // 2) Actualizar datos de la orden
    order.status = OrderStatusEnum.PROCCESING_PAY;
    order.deliveryAmount = input.deliveryAmount;
    order.deliveryName = input.deliveryName;

    // 2) Crear transacción PENDING
    const transactionData = new Transaction();
    transactionData.orderId = orderId;
    transactionData.status = OrderStatusEnum.PENDING;
    const { order: orderUpdated, transaction: transactionUpdated } =
      await this.updateOrderTransaction(order, transactionData);

    // 3) Ejecutar flujo de pasarela con el proveedor
    const paymentDataInput: ICreatePayWithCreditCardTransactionInput = {
      amount_in_cents:
        Number(orderUpdated.totalAmount) + Number(orderUpdated.deliveryAmount),
      currency: 'COP',
      customer_email: orderUpdated.customerEmail,
      reference: `${orderUpdated.id}_${Date.now()}`,
      card_number: input.cardNumber,
      exp_month: input.expMonth,
      exp_year: input.expYear,
      cvc: input.cvc,
      installments: input.installments,
      card_holder: input.cardHolder,
    };
    const paymentProviderResponse: ICreatePayWithCreditCardTransactionResponse =
      await this.doPayWithCreditCardWompiFlow(paymentDataInput);

    // 4) Actualizar datos de la transacción
    const transactionUpdatedResult = this.getPaymentDataToPersistInTransaction(
      transactionUpdated,
      paymentProviderResponse,
    );

    // 5) Guardar transacción actualizada con la primer respuesta del proveedor
    const updatedTransaction = await this.updateTransaction(
      transactionUpdatedResult,
    );

    // 6) Consultar polling de la transacción para obtener respuesta final y actualizar la orden y transacción
    const pollingTransactionResult =
      await this.pollingTransaction(updatedTransaction);

    orderUpdated.status = pollingTransactionResult.status as OrderStatusEnum;

    const result = await this.updateOrderTransaction(
      orderUpdated,
      pollingTransactionResult,
    );

    return result.transaction;
  }
  private async doPayWithCreditCardWompiFlow(
    input: ICreatePayWithCreditCardTransactionInput,
  ): Promise<ICreatePayWithCreditCardTransactionResponse> {
    const payWithCreditCardFlow =
      await this.wompiService.createPayWithCreditCardTransaction(input);
    return payWithCreditCardFlow;
  }

  private getPaymentDataToPersistInTransaction(
    createdTransaction: Transaction,
    paymentProviderResponse: ICreatePayWithCreditCardTransactionResponse,
  ): Transaction {
    const transaction = paymentProviderResponse.transaction;
    const pm = paymentProviderResponse.transactionInfo.payment_method;
    const pmExtra = pm?.extra ?? {};
    const merchant = paymentProviderResponse.merchantInfo;

    const toPersist = {
      status:
        transaction.status === 'PENDING'
          ? OrderStatusEnum.PROCCESING_PAY
          : transaction.status,
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
      ...createdTransaction,
      ...toPersist,
    };

    return transactionToUpdate;
  }

  private async pollingTransaction(
    transaction: Transaction,
  ): Promise<Transaction> {
    console.log('Iniciar pollTransactionStatus');
    const newTransactionResponse =
      await this.wompiService.pollTransactionStatus(
        transaction.providerTransactionId as string,
      );
    console.log('Resultado pollTransactionStatus', newTransactionResponse);

    transaction.status = OrderStatusEnum.CANCELLED;
    transaction.providerStatus = newTransactionResponse.status;
    transaction.providerStatusMessage = newTransactionResponse.status_message;
    transaction.providerRawLastResponse = JSON.stringify(
      newTransactionResponse,
    );
    if (newTransactionResponse.status === 'APPROVED') {
      transaction.status = OrderStatusEnum.CONFIRMED;
    }

    console.log('Retornar datos de la transacción', transaction);
    return transaction;
  }

  private async updateTransaction(
    transaction: Transaction,
  ): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }
  private async updateOrderTransaction(
    order: Order,
    transaction: Transaction,
  ): Promise<{ order: Order; transaction: Transaction }> {
    if (!order.transactions) {
      order.transactions = [];
    }

    let updatedTransaction: Transaction;

    if (transaction.id) {
      const existingTransactionIndex = order.transactions.findIndex(
        (t) => t.id === transaction.id,
      );

      if (existingTransactionIndex !== -1) {
        order.transactions[existingTransactionIndex] = transaction;
        updatedTransaction = transaction;
      } else {
        updatedTransaction = await this.transactionRepository.save(transaction);
        order.transactions.push(updatedTransaction);
      }
    } else {
      updatedTransaction = await this.transactionRepository.save(transaction);
      order.transactions.push(updatedTransaction);
    }

    const savedOrder = await this.orderRepository.save(order);
    return { order: savedOrder, transaction: updatedTransaction };
  }
}
