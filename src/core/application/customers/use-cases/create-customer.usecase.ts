import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '../../../domain/customers/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '../../../domain/customers/ports/customer-repository.port';
import type { CustomerRepositoryPort } from '../../../domain/customers/ports/customer-repository.port';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(data: Customer): Promise<Customer> {
    const existingCustomer = await this.repository.findByEmail(data.email);
    
    if (existingCustomer) {
      return existingCustomer;
    }
    
    return this.repository.create(data);
  }
}
