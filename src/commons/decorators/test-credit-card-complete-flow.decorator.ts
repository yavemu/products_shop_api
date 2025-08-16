import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { TestCreditCardFlowCreditCardTransactionDto } from '../dto/test-credit-card-complete-flow.dto';

export function ApiWompi() {
  return applyDecorators(ApiTags('Wompi'));
}

export function ApiTestCreditCardTransaction() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Prueba flujo completo de transacción con tarjeta de crédito en Wompi',
    }),
    ApiBody({ type: TestCreditCardFlowCreditCardTransactionDto }),
    ApiResponse({
      status: 201,
      description: 'Transacción creada exitosamente',
    }),
    ApiResponse({ status: 400, description: 'Solicitud inválida' }),
    ApiResponse({
      status: 502,
      description: 'Error en comunicación con Wompi',
    }),
  );
}
