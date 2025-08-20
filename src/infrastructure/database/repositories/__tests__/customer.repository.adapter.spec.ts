import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerOrmEntity } from '../../entities/customer.orm.entity';
import { Customer } from '../../../../core/domain/customers/entities/customer.entity';
import { CustomerRepositoryAdapter } from '../customer.repository.adapter';

describe('CustomerRepositoryAdapter', () => {
  let adapter: CustomerRepositoryAdapter;
  let repository: jest.Mocked<Repository<CustomerOrmEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepositoryAdapter,
        {
          provide: getRepositoryToken(CustomerOrmEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get(CustomerRepositoryAdapter);
    repository = module.get(getRepositoryToken(CustomerOrmEntity));
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a customer', async () => {
      const customer = {
        name: 'John',
        email: 'john@test.com',
        phone: '12345',
      } as Customer;

      const customerOrm = { id: 1, ...customer } as CustomerOrmEntity;

      repository.create.mockReturnValue(customerOrm);
      repository.save.mockResolvedValue(customerOrm);

      const result = await adapter.create(customer);

      expect(repository.create).toHaveBeenCalledWith(customer);
      expect(repository.save).toHaveBeenCalledWith(customerOrm);
      expect(result).toEqual(expect.objectContaining(customer));
      expect(result).toBeInstanceOf(Customer);
    });
  });

  describe('findByEmail', () => {
    it('should return a customer if found', async () => {
      const customerOrm = {
        id: 1,
        name: 'Jane',
        email: 'jane@test.com',
        phone: '54321',
      } as CustomerOrmEntity;
      repository.findOne.mockResolvedValue(customerOrm);

      const result = await adapter.findByEmail('jane@test.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'jane@test.com' },
      });
      expect(result).toBeInstanceOf(Customer);
      expect(result?.email).toBe('jane@test.com');
    });

    it('should return null if no customer found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await adapter.findByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });
});
