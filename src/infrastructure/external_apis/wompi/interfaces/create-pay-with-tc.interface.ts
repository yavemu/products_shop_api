import { MerchantData } from '../../../../infrastructure/external_apis/wompi/interfaces/get-merchant.interface';
import { TokenizeCreditCardData } from '../../../../infrastructure/external_apis/wompi/interfaces/create-tokenize-credit-card.interface';
import { CreateTransactionResponseData } from '../../../../infrastructure/external_apis/wompi/interfaces/create-transaction.interface';
import { GetTransactionInfoByIdResponse } from '../../../../infrastructure/external_apis/wompi/interfaces/get-transaction-by-id.interface';
export interface ICreatePayWithCreditCardTransactionInput {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  installments: number;
  card_holder: string;
}

export interface ICreatePayWithCreditCardTransactionResponse {
  merchantInfo: MerchantData;
  tokenize: TokenizeCreditCardData;
  transaction: CreateTransactionResponseData;
  transactionInfo: GetTransactionInfoByIdResponse;
}
