import { validate } from 'class-validator';
import { CreateCustomerDto } from '../create-customer.dto';

describe('CreateCustomerDto', () => {
  it('should validate a valid customer data', async () => {
    const dto = new CreateCustomerDto();
    dto.name = 'Juan Pérez';
    dto.email = 'juan.perez@email.com';
    dto.phone = '+57 300 123 4567';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty name', async () => {
    const dto = new CreateCustomerDto();
    dto.name = '';
    dto.email = 'juan.perez@email.com';
    dto.phone = '+57 300 123 4567';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with invalid email', async () => {
    const dto = new CreateCustomerDto();
    dto.name = 'Juan Pérez';
    dto.email = 'invalid-email';
    dto.phone = '+57 300 123 4567';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with empty phone', async () => {
    const dto = new CreateCustomerDto();
    dto.name = 'Juan Pérez';
    dto.email = 'juan.perez@email.com';
    dto.phone = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('phone');
  });

  it('should fail validation with name too long', async () => {
    const dto = new CreateCustomerDto();
    dto.name = 'a'.repeat(101);
    dto.email = 'juan.perez@email.com';
    dto.phone = '+57 300 123 4567';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with email too long', async () => {
    const dto = new CreateCustomerDto();
    dto.name = 'Juan Pérez';
    dto.email = 'a'.repeat(95) + '@email.com';
    dto.phone = '+57 300 123 4567';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with phone too long', async () => {
    const dto = new CreateCustomerDto();
    dto.name = 'Juan Pérez';
    dto.email = 'juan.perez@email.com';
    dto.phone = '+57 300 123 4567890123456789';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('phone');
  });
});