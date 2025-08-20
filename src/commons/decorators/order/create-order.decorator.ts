import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from '../../../interfaces/web/order/dto/create-order.dto';
import { ORDERS_EXAMPLE } from './constants';

const SUCCESS_RESPONSE = ORDERS_EXAMPLE[0];

const INPUT_DATA: CreateOrderDto = {
  customerId: SUCCESS_RESPONSE.customerId,
  customerName: SUCCESS_RESPONSE.customerName,
  customerEmail: SUCCESS_RESPONSE.customerEmail,
  customerPhone: SUCCESS_RESPONSE.customerPhone,
  shippingAddress: SUCCESS_RESPONSE.shippingAddress,
  products: [{ id: 1, quantity: 2 }],
};

export function CreateOrderSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear orden',
      description: 'Crea una nueva orden con los detalles proporcionados.',
    }),
    ApiBody({
      type: CreateOrderDto,
      examples: {
        'application/json': {
          value: INPUT_DATA,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Orden creada correctamente',
      schema: { example: SUCCESS_RESPONSE },
    }),
  );
}
