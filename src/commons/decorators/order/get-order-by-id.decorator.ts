import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ORDERS_EXAMPLE } from './constants/index';

const GET_BY_ID_SUCCESS_RESPONSE = ORDERS_EXAMPLE[0];

export function GetOrderByIdSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Consultar orden por ID',
      description:
        'Retorna la orden con el ID proporcionado, con sus detalles y productos asociados.',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID de la orden',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Orden encontrada correctamente',
      schema: { example: GET_BY_ID_SUCCESS_RESPONSE },
    }),
  );
}
