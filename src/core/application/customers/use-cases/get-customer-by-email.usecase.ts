import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '../../../domain/customers/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '../../../domain/customers/ports/customer-repository.port';
import type { CustomerRepositoryPort } from '../../../domain/customers/ports/customer-repository.port';

@Injectable()
export class GetCustomerByEmailUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(email: string): Promise<Customer | null> {
    return this.repository.findByEmail(email);
  }
}
