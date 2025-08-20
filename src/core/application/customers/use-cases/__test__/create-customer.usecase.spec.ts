import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerUseCase } from '../create-customer.usecase';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../../../domain/customers/ports/customer-repository.port';
import { Customer } from '../../../../domain/customers/entities/customer.entity';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let repository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerUseCase,
        {
          provide: CUSTOMER_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    repository = module.get(CUSTOMER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should call repository.create with data and return created customer when customer does not exist', async () => {
    const input: Customer = {
      id: '1',
      name: 'John Doe',
      email: 'john@test.com',
    } as Customer;
    const expected: Customer = { ...input };

    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockResolvedValue(expected);

    const result = await useCase.execute(input);

    expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(expected);
  });

  it('should return existing customer when customer with same email already exists', async () => {
    const input: Customer = {
      name: 'John Doe',
      email: 'john@test.com',
      phone: '123456789',
    } as Customer;
    const existingCustomer: Customer = {
      id: 1,
      name: 'Existing John',
      email: 'john@test.com',
      phone: '987654321',
    } as Customer;

    repository.findByEmail.mockResolvedValue(existingCustomer);

    const result = await useCase.execute(input);

    expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(repository.create).not.toHaveBeenCalled();
    expect(result).toEqual(existingCustomer);
  });

  it('should propagate errors from repository.create', async () => {
    const input: Customer = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@test.com',
    } as Customer;

    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(input)).rejects.toThrow('DB error');
    expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(repository.create).toHaveBeenCalledWith(input);
  });
});
