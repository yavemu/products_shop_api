import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../../interfaces/web/customer/dto/create-customer.dto';
import { CUSTOMERS_EXAMPLE } from './constants';

const SUCCESS_RESPONSE = CUSTOMERS_EXAMPLE[0];

const INPUT_DATA: CreateCustomerDto = {
  name: SUCCESS_RESPONSE.name,
  email: SUCCESS_RESPONSE.email,
  phone: SUCCESS_RESPONSE.phone,
};

export function CreateCustomerSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear cliente',
      description: 'Crea un nuevo cliente con los datos proporcionados.',
    }),
    ApiBody({
      type: CreateCustomerDto,
      examples: {
        'application/json': {
          value: INPUT_DATA,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Cliente creado correctamente',
      schema: { example: SUCCESS_RESPONSE },
    }),
    ApiResponse({
      status: 400,
      description: 'Error en los datos enviados',
    }),
  );
}
