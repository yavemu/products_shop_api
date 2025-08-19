import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PayOrderDto } from '../dto/pay-oder.dto';

describe('PayOrderDto', () => {
  const validDto = {
    deliveryAmount: 50000,
    deliveryName: 'Interrapidisimo',
    cardNumber: '4242424242424242',
    expMonth: '12',
    expYear: '29',
    cvc: '123',
    installments: 1,
    cardHolder: 'Juan Perez',
  };

  it('should pass with valid data', async () => {
    const dto = plainToInstance(PayOrderDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('Field validations', () => {
    it('should fail with invalid deliveryAmount', async () => {
      const invalidCases = [
        { ...validDto, deliveryAmount: 'abc' as any },
        { ...validDto, deliveryAmount: -1000 },
        { ...validDto, deliveryAmount: 0 },
      ];

      for (const testCase of invalidCases) {
        const dto = plainToInstance(PayOrderDto, testCase);
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'deliveryAmount')).toBe(true);
      }
    });

    it('should fail with invalid cardNumber', async () => {
      const invalidCases = [
        { ...validDto, cardNumber: '123456789012' },
        { ...validDto, cardNumber: '12345678901234567890' },
        { ...validDto, cardNumber: '4242-4242-4242-4242' },
        { ...validDto, cardNumber: '4242424242424abc' },
      ];

      for (const testCase of invalidCases) {
        const dto = plainToInstance(PayOrderDto, testCase);
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'cardNumber')).toBe(true);
      }
    });

    it('should fail with invalid expMonth', async () => {
      const invalidCases = [
        { ...validDto, expMonth: '1' },
        { ...validDto, expMonth: '00' },
        { ...validDto, expMonth: '13' },
        { ...validDto, expMonth: '1a' },
      ];

      for (const testCase of invalidCases) {
        const dto = plainToInstance(PayOrderDto, testCase);
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'expMonth')).toBe(true);
      }
    });

    it('should fail with invalid expYear', async () => {
      const invalidCases = [
        { ...validDto, expYear: '2' },
        { ...validDto, expYear: '20255' },
        { ...validDto, expYear: '2a' },
      ];

      for (const testCase of invalidCases) {
        const dto = plainToInstance(PayOrderDto, testCase);
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'expYear')).toBe(true);
      }
    });

    it('should fail with invalid cvc', async () => {
      const invalidCases = [
        { ...validDto, cvc: '12' },
        { ...validDto, cvc: '1234' },
        { ...validDto, cvc: '12a' },
      ];

      for (const testCase of invalidCases) {
        const dto = plainToInstance(PayOrderDto, testCase);
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'cvc')).toBe(true);
      }
    });

    it('should fail with invalid installments', async () => {
      const invalidCases = [
        { ...validDto, installments: 'invalid' as any },
        { ...validDto, installments: -1 },
        { ...validDto, installments: 0 },
      ];

      for (const testCase of invalidCases) {
        const dto = plainToInstance(PayOrderDto, testCase);
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'installments')).toBe(true);
      }
    });
  });

  describe('Valid variations', () => {
    it('should accept different valid card numbers', async () => {
      const validCards = [
        '4111111111111111',
        '5555555555554444',
        '378282246310005',
        '30569309025904',
      ];

      for (const cardNumber of validCards) {
        const dto = plainToInstance(PayOrderDto, { ...validDto, cardNumber });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });

    it('should accept valid installment values', async () => {
      const validInstallments = [1, 3, 6, 12, 24];

      for (const installments of validInstallments) {
        const dto = plainToInstance(PayOrderDto, { ...validDto, installments });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });

    it('should accept valid date formats', async () => {
      const validDates = [
        { expMonth: '01', expYear: '25' },
        { expMonth: '12', expYear: '2029' },
        { expMonth: '06', expYear: '30' },
      ];

      for (const dateCase of validDates) {
        const dto = plainToInstance(PayOrderDto, { ...validDto, ...dateCase });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });
});
