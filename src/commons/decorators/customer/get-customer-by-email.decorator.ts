import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CUSTOMERS_EXAMPLE } from './constants';

const SUCCESS_RESPONSE = CUSTOMERS_EXAMPLE[0];

export function GetCustomerByEmailSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Consultar cliente por email',
      description:
        'Obtener la información de un cliente usando su dirección de correo electrónico.',
    }),
    ApiParam({
      name: 'email',
      description: 'Dirección de correo electrónico del cliente',
      example: 'maria.garcia@email.com',
    }),
    ApiResponse({
      status: 200,
      description: 'Cliente encontrado correctamente',
      schema: { example: SUCCESS_RESPONSE },
    }),
    ApiResponse({
      status: 404,
      description: 'Cliente no encontrado',
    }),
  );
}
