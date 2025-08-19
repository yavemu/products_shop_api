import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

import { IWompiConfig } from '../../../config';
import {
  CreateCreditCardTransactionRequest,
  CreateTokenizeCreditCardInput,
  CreateCreditCardTransactionInput,
  CreateTransactionResponseData,
  MerchantData,
  TokenizeCreditCardData,
  GetTransactionInfoByIdResponse,
  ICreatePayWithCreditCardTransactionInput,
  ICreatePayWithCreditCardTransactionResponse,
} from './interfaces';

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);

  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrityKey: string;
  private readonly endpointsV1: IWompiConfig['endpoints']['v1'];

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    const wompiConfig = this.config.getOrThrow<IWompiConfig>('wompi_config');

    this.publicKey = wompiConfig.publicKey;
    this.privateKey = wompiConfig.privateKey;
    this.integrityKey = wompiConfig.integrityKey;
    this.endpointsV1 = wompiConfig.endpoints.v1;
  }

  async getMerchantInfo(): Promise<MerchantData> {
    const url = `${this.endpointsV1.getMerchantInfo(this.publicKey)}`;
    try {
      const response = await firstValueFrom(this.http.get(url));

      return response.data?.data as MerchantData;
    } catch (err: any) {
      this.logger.error('Error fetching merchant info:', err);
      throw new HttpException(
        {
          message: 'Failed to fetch info from merchant',
          detail: err?.response?.data ?? err?.message ?? err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async createTokenizeCreditCard(
    input: CreateTokenizeCreditCardInput,
  ): Promise<TokenizeCreditCardData> {
    const url = `${this.endpointsV1.createTokenizeCard}`;
    try {
      const response = await firstValueFrom(
        this.http.post(
          url,
          { ...input },
          {
            headers: { Authorization: `Bearer ${this.publicKey}` },
          },
        ),
      );

      return response.data?.data as TokenizeCreditCardData;
    } catch (err: any) {
      this.logger.error('Error tokenizing card:', err);
      throw new HttpException(
        {
          message: 'Card tokenization failed',
          detail: err?.response?.data ?? err?.message ?? err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createCreditCardTransaction(
    input: CreateCreditCardTransactionInput,
  ): Promise<CreateTransactionResponseData> {
    const base = `${input.reference}${input.amount_in_cents}${input.currency}${this.integrityKey}`;
    const signature = crypto.createHash('sha256').update(base).digest('hex');

    const body: CreateCreditCardTransactionRequest = {
      amount_in_cents: input.amount_in_cents,
      currency: input.currency,
      customer_email: input.customer_email,
      payment_method: {
        type: 'CARD',
        ...input.payment_method,
      },
      reference: input.reference,
      signature,
      acceptance_token: input.acceptance_token,
    };

    try {
      const url = `${this.endpointsV1.createTransactions}`;
      const response = await firstValueFrom(
        this.http.post(url, body, {
          headers: { Authorization: `Bearer ${this.privateKey}` },
        }),
      );

      return response.data?.data as CreateTransactionResponseData;
    } catch (err: any) {
      throw new HttpException(
        {
          message: 'Create transaction failed',
          detail: err?.response?.data ?? err?.message ?? err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTransactionInfoById(
    transactionId: string,
  ): Promise<GetTransactionInfoByIdResponse> {
    const url = this.endpointsV1.getTransactionInfoById(transactionId);

    try {
      const response = await firstValueFrom(
        this.http.get(url, {
          headers: { Authorization: `Bearer ${this.publicKey}` },
        }),
      );
      return response.data?.data as GetTransactionInfoByIdResponse;
    } catch (err: any) {
      throw new HttpException(
        {
          message: 'Failed to fetch transaction info',
          detail: err?.response?.data ?? err?.message ?? err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPayWithCreditCardTransaction(
    input: ICreatePayWithCreditCardTransactionInput,
  ): Promise<ICreatePayWithCreditCardTransactionResponse> {
    try {
      // 1. Obtener información del comerciante
      const merchantInfo = await this.getMerchantInfo();

      // 2. Tokenizar tarjeta
      const tokenize: TokenizeCreditCardData =
        await this.createTokenizeCreditCard({
          number: input.card_number,
          exp_month: input.exp_month,
          exp_year: input.exp_year,
          cvc: input.cvc,
          card_holder: input.card_holder,
        });

      // 3. Crear transacción con ese token
      const transactionInput: CreateCreditCardTransactionInput = {
        amount_in_cents: input.amount_in_cents,
        currency: input.currency,
        customer_email: input.customer_email,
        acceptance_token: merchantInfo.presigned_acceptance.acceptance_token,
        reference: `${input.reference}_${Date.now()}`,
        payment_method: {
          installments: input.installments,
          token: tokenize.id,
        },
      };
      const transaction =
        await this.createCreditCardTransaction(transactionInput);

      // 4. Obtener información de la transacción
      const transactionInfo = await this.getTransactionInfoById(transaction.id);

      return { merchantInfo, tokenize, transaction, transactionInfo };
    } catch (error) {
      this.logger.error('Error en testWompiFlow', error);
      throw error;
    }
  }

  async pollTransactionStatus(
    transactionId: string,
    maxAttempts: number = 5,
    intervalMs: number = 1000,
  ): Promise<GetTransactionInfoByIdResponse> {
    const finalStatuses = ['ERROR', 'APPROVED'] as const;
    let attempts = 0;
    let lastResponse: GetTransactionInfoByIdResponse | undefined;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        this.logger.log(
          `Retry ${attempts}/${maxAttempts} to get transaction by id ${transactionId}`,
        );

        const response: GetTransactionInfoByIdResponse =
          await this.getTransactionInfoById(transactionId);

        if (!response || !('status' in response) || !response.status) {
          this.logger.warn(`Invalid response format on attempt ${attempts}`);
        } else {
          lastResponse = response;
          const status = response.status;

          this.logger.log(`Current status: ${status} (retry ${attempts})`);

          if (
            finalStatuses.includes(status as (typeof finalStatuses)[number])
          ) {
            this.logger.log(
              `Final status reached: ${status} after ${attempts} attempts`,
            );
            return response;
          }
        }

        if (attempts < maxAttempts) {
          await this.delay(intervalMs);
        }
      } catch (error: any) {
        this.logger.error(
          `Error retrieving transaction on attempt ${attempts}: ${error?.message ?? error}`,
        );

        if (attempts < maxAttempts) {
          await this.delay(intervalMs);
        }
      }
    }

    if (!lastResponse) {
      throw new Error(
        `Failed to retrieve transaction ${maxAttempts} attempts for transaction ${transactionId}`,
      );
    }
    return lastResponse;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
