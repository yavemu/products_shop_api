import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  CreateCustomerUseCase,
  GetCustomerByEmailUseCase,
} from '../../../core/application/customers/use-cases';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from '../../../core/domain/customers/entities/customer.entity';
import {
  CreateCustomerSwaggerDecorator,
  GetCustomerByEmailSwaggerDecorator,
} from '../../../commons/decorators';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomer: CreateCustomerUseCase,
    private readonly getCustomerByEmail: GetCustomerByEmailUseCase,
  ) {}

  @Get('email/:email')
  @GetCustomerByEmailSwaggerDecorator()
  async getByEmail(@Param('email') email: string): Promise<Customer | null> {
    return this.getCustomerByEmail.execute(email);
  }

  @Post()
  @CreateCustomerSwaggerDecorator()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.createCustomer.execute(createCustomerDto);
  }
}
