import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ORDERS_EXAMPLE } from './constants';

export function FindAllOrdersSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Consultar todas las ordenes',
      description:
        'Retorna todas las ordenes existentes, con sus detalles y productos asociados.',
    }),
    ApiResponse({
      status: 200,
      description: 'Ordenes encontradas correctamente',
      schema: { example: ORDERS_EXAMPLE },
    }),
  );
}
