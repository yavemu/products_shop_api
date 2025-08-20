import { Test, TestingModule } from '@nestjs/testing';
import { GetCustomerByEmailUseCase } from '../get-customer-by-email.usecase';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../../../domain/customers/ports/customer-repository.port';
import { Customer } from '../../../../domain/customers/entities/customer.entity';

describe('GetCustomerByEmailUseCase', () => {
  let useCase: GetCustomerByEmailUseCase;
  let repository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomerByEmailUseCase,
        {
          provide: CUSTOMER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetCustomerByEmailUseCase>(GetCustomerByEmailUseCase);
    repository = module.get(CUSTOMER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return a customer when found', async () => {
    const email = 'john@test.com';
    const customer: Customer = { id: '1', name: 'John Doe', email } as Customer;

    repository.findByEmail.mockResolvedValue(customer);

    const result = await useCase.execute(email);

    expect(repository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(customer);
  });

  it('should return null when no customer is found', async () => {
    const email = 'notfound@test.com';

    repository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute(email);

    expect(repository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toBeNull();
  });

  it('should propagate errors from repository.findByEmail', async () => {
    const email = 'error@test.com';

    repository.findByEmail.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(email)).rejects.toThrow('DB error');
    expect(repository.findByEmail).toHaveBeenCalledWith(email);
  });
});
