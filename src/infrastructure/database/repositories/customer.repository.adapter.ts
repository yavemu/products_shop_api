import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../../core/domain/customers/entities/customer.entity';
import { CustomerRepositoryPort } from '../../../core/domain/customers/ports/customer-repository.port';
import { CustomerOrmEntity } from '../entities/customer.orm.entity';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const customerEntity = this.repository.create(customer);
    const savedCustomer = await this.repository.save(customerEntity);
    return this.mapToDomain(savedCustomer);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.repository.findOne({
      where: { email },
    });
    return customer ? this.mapToDomain(customer) : null;
  }

  private mapToDomain(ormEntity: CustomerOrmEntity): Customer {
    const customer = new Customer();
    customer.id = ormEntity.id;
    customer.name = ormEntity.name;
    customer.email = ormEntity.email;
    customer.phone = ormEntity.phone;
    return customer;
  }
}
