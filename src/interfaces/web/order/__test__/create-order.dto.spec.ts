import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateOrderDto,
  CreateOrderProductsDto,
} from '../dto/create-order.dto';

describe('CreateOrderProductsDto', () => {
  it('should transform string numbers to integers', () => {
    const product = plainToInstance(CreateOrderProductsDto, {
      id: '1',
      quantity: '2',
    });

    expect(product.id).toBe(1);
    expect(product.quantity).toBe(2);
  });

  describe('Validation', () => {
    const validProduct = { id: 1, quantity: 2 };

    it('should pass with valid data', async () => {
      const product = plainToInstance(CreateOrderProductsDto, validProduct);
      const errors = await validate(product);
      expect(errors.length).toBe(0);
    });

    it('should fail if id is missing', async () => {
      const product = plainToInstance(CreateOrderProductsDto, { quantity: 2 });
      const errors = await validate(product);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should fail if id is less than 1', async () => {
      const product = plainToInstance(CreateOrderProductsDto, {
        id: 0,
        quantity: 2,
      });
      const errors = await validate(product);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail if quantity is missing', async () => {
      const product = plainToInstance(CreateOrderProductsDto, { id: 1 });
      const errors = await validate(product);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should fail if quantity is less than 1', async () => {
      const product = plainToInstance(CreateOrderProductsDto, {
        id: 1,
        quantity: 0,
      });
      const errors = await validate(product);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('min');
    });
  });
});

describe('CreateOrderDto', () => {
  const validDto = {
    customerId: 1,
    deliveryId: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    shippingAddress: '123 Main St',
    products: [{ id: 1, quantity: 2 }],
  };

  it('should pass with valid data', async () => {
    const dto = plainToInstance(CreateOrderDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform product string numbers to integers', () => {
    const dto = plainToInstance(CreateOrderDto, {
      ...validDto,
      products: [{ id: '1', quantity: '2' }],
    });

    expect(dto.products[0].id).toBe(1);
    expect(dto.products[0].quantity).toBe(2);
  });

  describe('Validation', () => {
    it('should fail if customerId is missing', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        customerId: undefined,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should fail if customerId is less than 1', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        customerId: 0,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail if customerName is missing', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        customerName: undefined,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail if customerEmail is invalid', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        customerEmail: 'invalid-email',
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should pass without customerPhone (optional)', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        customerPhone: undefined,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if shippingAddress is missing', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        shippingAddress: undefined,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail if products array is empty', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        products: [],
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('arrayMinSize');
    });

    it('should fail if products is missing', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        products: undefined,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should validate nested products', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validDto,
        products: [
          { id: 0, quantity: 0 }, // Invalid product
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].children[0].children[0].constraints).toHaveProperty(
        'min',
      );
    });
  });
});
