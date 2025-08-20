import { Customer } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

export interface CustomerRepositoryPort {
  create(customer: Customer): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
}
