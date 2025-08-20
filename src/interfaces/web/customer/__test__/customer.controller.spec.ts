import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import {
  CreateCustomerUseCase,
  GetCustomerByEmailUseCase,
} from '../../../../core/application/customers/use-cases';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../../../../core/domain/customers/entities/customer.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let createCustomerUseCase: CreateCustomerUseCase;
  let getCustomerByEmailUseCase: GetCustomerByEmailUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CreateCustomerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetCustomerByEmailUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    createCustomerUseCase = module.get<CreateCustomerUseCase>(
      CreateCustomerUseCase,
    );
    getCustomerByEmailUseCase = module.get<GetCustomerByEmailUseCase>(
      GetCustomerByEmailUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(createCustomerUseCase).toBeDefined();
    expect(getCustomerByEmailUseCase).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateCustomerUseCase with dto and return a customer', async () => {
      const dto: CreateCustomerDto = {
        name: 'John',
        email: 'john@test.com',
      } as CreateCustomerDto;
      const customer: Customer = {
        id: '1',
        name: 'John',
        email: 'john@test.com',
      } as Customer;

      (createCustomerUseCase.execute as jest.Mock).mockResolvedValue(customer);

      const result = await controller.create(dto);

      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(customer);
    });

    it('should propagate errors from CreateCustomerUseCase', async () => {
      const dto: CreateCustomerDto = {
        name: 'John',
        email: 'john@test.com',
      } as CreateCustomerDto;
      (createCustomerUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      await expect(controller.create(dto)).rejects.toThrow('Error');
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('getByEmail', () => {
    it('should call GetCustomerByEmailUseCase with email and return a customer', async () => {
      const email = 'john@test.com';
      const customer: Customer = { id: '1', name: 'John', email } as Customer;

      (getCustomerByEmailUseCase.execute as jest.Mock).mockResolvedValue(
        customer,
      );

      const result = await controller.getByEmail(email);

      expect(getCustomerByEmailUseCase.execute).toHaveBeenCalledWith(email);
      expect(result).toEqual(customer);
    });

    it('should return null if no customer is found', async () => {
      const email = 'notfound@test.com';
      (getCustomerByEmailUseCase.execute as jest.Mock).mockResolvedValue(null);

      const result = await controller.getByEmail(email);

      expect(getCustomerByEmailUseCase.execute).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should propagate errors from GetCustomerByEmailUseCase', async () => {
      const email = 'error@test.com';
      (getCustomerByEmailUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      await expect(controller.getByEmail(email)).rejects.toThrow('Error');
      expect(getCustomerByEmailUseCase.execute).toHaveBeenCalledWith(email);
    });
  });
});
