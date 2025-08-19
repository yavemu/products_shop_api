import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PRODUCTS_EXAMPLE } from './constants';

const GET_BY_ID_SUCCESS_RESPONSE = PRODUCTS_EXAMPLE[0];

export function GetProductByIdSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Consultar producto por ID',
      description: 'Retorna el producto con el ID proporcionado.',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID del producto',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Producto encontrada correctamente',
      schema: { example: GET_BY_ID_SUCCESS_RESPONSE },
    }),
  );
}
