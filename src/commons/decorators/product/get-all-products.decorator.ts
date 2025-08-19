import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PRODUCTS_EXAMPLE } from './constants';

export function FindAllProductsSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Consultar todos las productos',
      description: 'Retorna todos las productos existentes.',
    }),
    ApiResponse({
      status: 200,
      description: 'Productos encontrados correctamente',
      schema: { example: PRODUCTS_EXAMPLE },
    }),
  );
}
