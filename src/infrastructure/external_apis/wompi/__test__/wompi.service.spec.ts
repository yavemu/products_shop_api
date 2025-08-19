import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import * as crypto from 'crypto';

import { WompiService } from '../wompi.service';
import {
  CreateTokenizeCreditCardInput,
  CreateCreditCardTransactionInput,
  MerchantData,
  TokenizeCreditCardData,
  CreateTransactionResponseData,
  GetTransactionInfoByIdResponse,
} from '../interfaces';

jest.mock('crypto', () => ({
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('generated_signature'),
  })),
}));

const MOCK_WOMPI_CONFIG = {
  publicKey: 'pub_test_123',
  privateKey: 'prv_test_456',
  integrityKey: 'int_test_789',
  endpoints: {
    v1: {
      getMerchantInfo: jest.fn(
        (publicKey: string) => `https://api.wompi.co/v1/merchants/${publicKey}`,
      ),
      createTokenizeCard: 'https://api.wompi.co/v1/tokens/cards',
      createTransactions: 'https://api.wompi.co/v1/transactions',
      getTransactionInfoById: jest.fn(
        (transactionId: string) =>
          `https://api.wompi.co/v1/transactions/${transactionId}`,
      ),
    },
  },
};

const MOCK_MERCHANT_DATA: MerchantData = {
  id: 1,
  name: 'Test Merchant',
  email: 'test@merchant.com',
  contact_name: 'John Doe',
  phone_number: '+57123456789',
  active: true,
  logo_url: 'https://example.com/logo.png',
  legal_name: 'Test Merchant Legal',
  legal_id_type: 'CC',
  legal_id: '123456789',
  public_key: 'pub_test_123',
};

const MOCK_TOKENIZE_INPUT: CreateTokenizeCreditCardInput = {
  number: '4242424242424242',
  cvc: '123',
  exp_month: '12',
  exp_year: '25',
  card_holder: 'John Doe',
};

const MOCK_TOKEN_DATA: TokenizeCreditCardData = {
  id: 'tok_test_123',
  created_at: '2025-08-19T10:00:00.000Z',
  brand: 'VISA',
  name: 'John Doe',
  last_four: '4242',
  bin: '424242',
  exp_year: '25',
  exp_month: '12',
  card_type: 'CREDIT',
  expires_at: '2025-12-31T23:59:59.000Z',
};

const MOCK_CREATE_TX_INPUT: CreateCreditCardTransactionInput = {
  amount_in_cents: 10000,
  currency: 'COP',
  customer_email: 'customer@test.com',
  reference: 'ref_123',
  acceptance_token: 'accept_123',
  payment_method: {
    token: 'tok_test_123',
    installments: 1,
  },
};

const MOCK_CREATE_TX_RESPONSE: CreateTransactionResponseData = {
  id: 'trans_123',
  created_at: '2025-08-19T10:00:00.000Z',
  finalized_at: null,
  amount_in_cents: 10000,
  reference: 'ref_123',
  customer_email: 'customer@test.com',
  currency: 'COP',
  payment_method_type: 'CARD',
  payment_method: {
    type: 'CARD',
    extra: {
      bin: '424242',
      name: 'John Doe',
      brand: 'VISA',
      exp_year: '25',
      exp_month: '12',
      last_four: '4242',
      card_type: 'CREDIT',
    },
    installments: 1,
  },
  status: 'PENDING',
  status_message: null,
  merchant: {
    name: 'Test Merchant',
    legal_name: 'Test Merchant Legal',
    contact_name: 'John Doe',
    phone_number: '+57123456789',
    logo_url: 'https://example.com/logo.png',
    legal_id_type: 'CC',
    email: 'test@merchant.com',
    legal_id: '123456789',
  },
  taxes: [],
  tip_in_cents: 0,
  customer_data: {
    phone_number: '+57123456789',
    full_name: 'Customer Name',
  },
  billing_data: null,
  shipping_address: null,
  redirect_url: null,
  payment_source_id: null,
  payment_link_id: null,
  customer_user_agent: null,
  acceptance_token: 'accept_123',
  acceptance_date: '2025-08-19T10:00:00.000Z',
  signature: 'generated_signature',
  desired_installments: null,
};

const TX_ID = 'trans_123';

const MOCK_GET_TX_BY_ID_RESPONSE: GetTransactionInfoByIdResponse = {
  id: 'trans_123',
  created_at: '2025-08-19T10:00:00.000Z',
  finalized_at: '2025-08-19T10:01:00.000Z',
  amount_in_cents: 10000,
  reference: 'ref_123',
  customer_email: 'customer@test.com',
  currency: 'COP',
  payment_method_type: 'CARD',
  payment_method: {
    type: 'CARD',
    extra: {
      bin: '424242',
      name: 'John Doe',
      brand: 'VISA',
      exp_year: '25',
      exp_month: '12',
      last_four: '4242',
      card_type: 'CREDIT',
    },
    installments: 1,
  },
  status: 'APPROVED',
  status_message: 'Transaction approved',
  merchant: {
    name: 'Test Merchant',
    legal_name: 'Test Merchant Legal',
    contact_name: 'John Doe',
    phone_number: '+57123456789',
    logo_url: 'https://example.com/logo.png',
    legal_id_type: 'CC',
    email: 'test@merchant.com',
    legal_id: '123456789',
  },
  taxes: [],
  tip_in_cents: 0,
  customer_data: {
    phone_number: '+57123456789',
    full_name: 'Customer Name',
  },
  billing_data: null,
  shipping_address: null,
  redirect_url: null,
  payment_source_id: null,
  payment_link_id: null,
  customer_user_agent: null,
  acceptance_token: 'accept_123',
  acceptance_date: '2025-08-19T10:00:00.000Z',
  signature: 'generated_signature',
  desired_installments: null,
};

const merchantInfoUrl = (publicKey = MOCK_WOMPI_CONFIG.publicKey) =>
  `https://api.wompi.co/v1/merchants/${publicKey}`;

const tokenizeUrl = () => `https://api.wompi.co/v1/tokens/cards`;
const transactionsUrl = () => `https://api.wompi.co/v1/transactions`;

const txInfoUrl = (id: string) => `https://api.wompi.co/v1/transactions/${id}`;

describe('WompiService', () => {
  let service: WompiService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        getOrThrow: jest.fn().mockReturnValue(MOCK_WOMPI_CONFIG),
      })
      .compile();

    service = module.get<WompiService>(WompiService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with valid configuration', () => {
      expect(service).toBeDefined();
      expect(configService).toBeDefined();
    });
  });

  describe('getMerchantInfo', () => {
    it('should return merchant info successfully', async () => {
      const mockResponse = { data: { data: MOCK_MERCHANT_DATA } };
      httpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getMerchantInfo();

      expect(result).toEqual(MOCK_MERCHANT_DATA);
      expect(httpService.get).toHaveBeenCalledWith(merchantInfoUrl());
    });

    it('should throw HttpException when request fails', async () => {
      const mockError = { response: { data: { error: 'Merchant not found' } } };
      httpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getMerchantInfo()).rejects.toThrow(
        new HttpException(
          {
            message: 'Failed to fetch info from merchant',
            detail: mockError.response.data,
          },
          HttpStatus.BAD_GATEWAY,
        ),
      );
    });
  });

  describe('createTokenizeCreditCard', () => {
    it('should create tokenized credit card successfully', async () => {
      const mockResponse = { data: { data: MOCK_TOKEN_DATA } };
      httpService.post.mockReturnValue(of(mockResponse));

      const result =
        await service.createTokenizeCreditCard(MOCK_TOKENIZE_INPUT);

      expect(result).toEqual(MOCK_TOKEN_DATA);
      expect(httpService.post).toHaveBeenCalledWith(
        tokenizeUrl(),
        MOCK_TOKENIZE_INPUT,
        { headers: { Authorization: 'Bearer pub_test_123' } },
      );
    });

    it('should throw HttpException when tokenization fails', async () => {
      const mockError = {
        response: { data: { error: 'Invalid card number' } },
      };
      httpService.post.mockReturnValue(throwError(() => mockError));

      await expect(
        service.createTokenizeCreditCard(MOCK_TOKENIZE_INPUT),
      ).rejects.toThrow(
        new HttpException(
          {
            message: 'Card tokenization failed',
            detail: mockError.response.data,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('createCreditCardTransaction', () => {
    it('should create credit card transaction successfully', async () => {
      const mockResponse = { data: { data: MOCK_CREATE_TX_RESPONSE } };
      httpService.post.mockReturnValue(of(mockResponse));

      const result =
        await service.createCreditCardTransaction(MOCK_CREATE_TX_INPUT);

      expect(result).toEqual(MOCK_CREATE_TX_RESPONSE);
      expect(httpService.post).toHaveBeenCalledWith(
        transactionsUrl(),
        {
          amount_in_cents: 10000,
          currency: 'COP',
          customer_email: 'customer@test.com',
          payment_method: {
            type: 'CARD',
            token: 'tok_test_123',
            installments: 1,
          },
          reference: 'ref_123',
          signature: 'generated_signature',
          acceptance_token: 'accept_123',
        },
        { headers: { Authorization: 'Bearer prv_test_456' } },
      );
    });

    it('should throw HttpException when transaction creation fails', async () => {
      const mockError = {
        response: { data: { error: 'Invalid payment method' } },
      };
      httpService.post.mockReturnValue(throwError(() => mockError));

      await expect(
        service.createCreditCardTransaction(MOCK_CREATE_TX_INPUT),
      ).rejects.toThrow(
        new HttpException(
          {
            message: 'Create transaction failed',
            detail: mockError.response.data,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getTransactionInfoById', () => {
    it('should get transaction info successfully', async () => {
      const mockResponse = { data: { data: MOCK_GET_TX_BY_ID_RESPONSE } };
      httpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getTransactionInfoById(TX_ID);

      expect(result).toEqual(MOCK_GET_TX_BY_ID_RESPONSE);
      expect(httpService.get).toHaveBeenCalledWith(txInfoUrl(TX_ID), {
        headers: { Authorization: 'Bearer pub_test_123' },
      });
    });

    it('should throw HttpException when getting transaction info fails', async () => {
      const mockError = {
        response: { data: { error: 'Transaction not found' } },
      };
      httpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getTransactionInfoById(TX_ID)).rejects.toThrow(
        new HttpException(
          {
            message: 'Failed to fetch transaction info',
            detail: mockError.response.data,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
