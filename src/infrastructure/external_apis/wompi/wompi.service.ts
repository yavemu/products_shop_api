import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

import { IWompiConfig } from '../../../config';
import { GetTransactionInfoResponse } from './interfaces/get-transaction-by-id.interface';
import {
  CreateCreditCardTransactionRequest,
  CreateTokenizeCreditCardInput,
  CreateCreditCardTransactionInput,
  CreateTransactionResponseData,
  MerchantData,
  TokenizeCreditCardData,
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

    if (!this.publicKey || !this.privateKey || !this.integrityKey) {
      this.logger.warn('[WompiService] Configuración incompleta.');
    }
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

  async getTransactionInfo(
    transactionId: string,
  ): Promise<GetTransactionInfoResponse> {
    const url = this.endpointsV1.getTransactionInfo(transactionId);

    try {
      const response = await firstValueFrom(
        this.http.get(url, {
          headers: { Authorization: `Bearer ${this.publicKey}` },
        }),
      );
      return response.data?.data as GetTransactionInfoResponse;
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
}
