import { GetTransactionInfoByIdResponse } from '../../../../infrastructure/external_apis/wompi/interfaces/get-transaction-by-id.interface';
import {
  CreateCreditCardTransactionInput,
  CreateTokenizeCreditCardInput,
  CreateTransactionResponseData,
  MerchantData,
  TokenizeCreditCardData,
} from '../../../../infrastructure/external_apis/wompi/interfaces';

export interface PaymentGateway {
  getMerchantInfo(): Promise<MerchantData>;
  createTokenizeCreditCard(
    input: CreateTokenizeCreditCardInput,
  ): Promise<TokenizeCreditCardData>;
  createCreditCardTransaction(
    input: CreateCreditCardTransactionInput,
  ): Promise<CreateTransactionResponseData>;
  getTransaction(
    transactionId: string,
  ): Promise<GetTransactionInfoByIdResponse>;
}
