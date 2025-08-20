import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateDeliveryDto } from '../../../interfaces/web/delivery/dto/create-delivery.dto';
import { DELIVERIES_EXAMPLE } from './constants';

const SUCCESS_RESPONSE = DELIVERIES_EXAMPLE[0];

const INPUT_DATA: CreateDeliveryDto = {
  trackingNumber: SUCCESS_RESPONSE.trackingNumber,
  deliveryAddress: SUCCESS_RESPONSE.deliveryAddress,
  deliveryFee: SUCCESS_RESPONSE.deliveryFee,
  status: SUCCESS_RESPONSE.status,
};

export function CreateDeliverySwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear entrega',
      description:
        'Crea una nueva entrega para un pedido con los datos de envío proporcionados.',
    }),
    ApiBody({
      type: CreateDeliveryDto,
      examples: {
        'application/json': {
          value: INPUT_DATA,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Entrega creada correctamente',
      schema: { example: SUCCESS_RESPONSE },
    }),
    ApiResponse({
      status: 400,
      description: 'Error en los datos enviados',
    }),
  );
}
