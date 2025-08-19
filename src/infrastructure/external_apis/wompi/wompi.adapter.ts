import { PaymentGateway } from '../../../core/domain/payments/ports/payments-gateway.port';
import { WompiService } from './wompi.service';
import {
  CreateCreditCardTransactionInput,
  CreateTokenizeCreditCardInput,
  CreateTransactionResponseData,
  MerchantData,
  TokenizeCreditCardData,
} from './interfaces';
import { GetTransactionInfoByIdResponse } from './interfaces/get-transaction-by-id.interface';

export class WompiAdapter implements PaymentGateway {
  constructor(private readonly service: WompiService) {}

  async getMerchantInfo(): Promise<MerchantData> {
    const merchantInfo = await this.service.getMerchantInfo();

    return merchantInfo;
  }

  async createTokenizeCreditCard(
    input: CreateTokenizeCreditCardInput,
  ): Promise<TokenizeCreditCardData> {
    const tokenizeCard = await this.service.createTokenizeCreditCard(input);

    return tokenizeCard;
  }

  async createCreditCardTransaction(
    input: CreateCreditCardTransactionInput,
  ): Promise<CreateTransactionResponseData> {
    const transaction = await this.service.createCreditCardTransaction(input);

    return transaction;
  }

  async getTransaction(
    transactionId: string,
  ): Promise<GetTransactionInfoByIdResponse> {
    const transaction =
      await this.service.getTransactionInfoById(transactionId);

    return transaction;
  }
}
