import { WompiAdapter } from '../wompi.adapter';
import { WompiService } from '../wompi.service';
import {
  CreateCreditCardTransactionInput,
  CreateTokenizeCreditCardInput,
  CreateTransactionResponseData,
  MerchantData,
  TokenizeCreditCardData,
} from '../interfaces';
import { GetTransactionInfoByIdResponse } from '../interfaces/get-transaction-by-id.interface';

describe('WompiAdapter', () => {
  let adapter: WompiAdapter;
  let wompiService: jest.Mocked<WompiService>;

  const MOCK_MERCHANT: MerchantData = {
    id: 1,
    name: 'Test Merchant',
    email: 'merchant@test.com',
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

  const MOCK_TOKEN: TokenizeCreditCardData = {
    id: 'tok_123',
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

  const MOCK_TX_INPUT: CreateCreditCardTransactionInput = {
    amount_in_cents: 10000,
    currency: 'COP',
    customer_email: 'customer@test.com',
    reference: 'ref_123',
    acceptance_token: 'accept_123',
    payment_method: { token: 'tok_123', installments: 1 },
  };

  const MOCK_TX_RESPONSE: CreateTransactionResponseData = {
    id: 'tx_123',
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
      email: 'merchant@test.com',
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

  const MOCK_TX_INFO: GetTransactionInfoByIdResponse = {
    ...MOCK_TX_RESPONSE,
    status: 'APPROVED',
    finalized_at: '2025-08-19T10:01:00.000Z',
    status_message: 'Approved',
  };

  beforeEach(() => {
    wompiService = {
      getMerchantInfo: jest.fn(),
      createTokenizeCreditCard: jest.fn(),
      createCreditCardTransaction: jest.fn(),
      getTransactionInfoById: jest.fn(),
    } as unknown as jest.Mocked<WompiService>;

    adapter = new WompiAdapter(wompiService);
  });

  describe('getMerchantInfo', () => {
    it('should return merchant info', async () => {
      wompiService.getMerchantInfo.mockResolvedValue(MOCK_MERCHANT);

      const result = await adapter.getMerchantInfo();

      expect(result).toEqual(MOCK_MERCHANT);
      expect(wompiService.getMerchantInfo).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors', async () => {
      wompiService.getMerchantInfo.mockRejectedValue(new Error('API error'));

      await expect(adapter.getMerchantInfo()).rejects.toThrow('API error');
    });
  });

  describe('createTokenizeCreditCard', () => {
    it('should return tokenized card', async () => {
      wompiService.createTokenizeCreditCard.mockResolvedValue(MOCK_TOKEN);

      const result =
        await adapter.createTokenizeCreditCard(MOCK_TOKENIZE_INPUT);

      expect(result).toEqual(MOCK_TOKEN);
      expect(wompiService.createTokenizeCreditCard).toHaveBeenCalledWith(
        MOCK_TOKENIZE_INPUT,
      );
    });

    it('should propagate errors', async () => {
      wompiService.createTokenizeCreditCard.mockRejectedValue(
        new Error('Invalid card'),
      );

      await expect(
        adapter.createTokenizeCreditCard(MOCK_TOKENIZE_INPUT),
      ).rejects.toThrow('Invalid card');
    });
  });

  describe('createCreditCardTransaction', () => {
    it('should return created transaction', async () => {
      wompiService.createCreditCardTransaction.mockResolvedValue(
        MOCK_TX_RESPONSE,
      );

      const result = await adapter.createCreditCardTransaction(MOCK_TX_INPUT);

      expect(result).toEqual(MOCK_TX_RESPONSE);
      expect(wompiService.createCreditCardTransaction).toHaveBeenCalledWith(
        MOCK_TX_INPUT,
      );
    });

    it('should propagate errors', async () => {
      wompiService.createCreditCardTransaction.mockRejectedValue(
        new Error('Transaction failed'),
      );

      await expect(
        adapter.createCreditCardTransaction(MOCK_TX_INPUT),
      ).rejects.toThrow('Transaction failed');
    });
  });

  describe('getTransaction', () => {
    it('should return transaction info', async () => {
      wompiService.getTransactionInfoById.mockResolvedValue(MOCK_TX_INFO);

      const result = await adapter.getTransaction('tx_123');

      expect(result).toEqual(MOCK_TX_INFO);
      expect(wompiService.getTransactionInfoById).toHaveBeenCalledWith(
        'tx_123',
      );
    });

    it('should propagate errors', async () => {
      wompiService.getTransactionInfoById.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(adapter.getTransaction('tx_123')).rejects.toThrow(
        'Transaction not found',
      );
    });
  });
});
