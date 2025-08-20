import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TestCreditCardFlowCreditCardTransactionDto } from './commons/dto/test-credit-card-complete-flow.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('WompiTest')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('run-credit-card-flow')
  @ApiOperation({
    summary:
      'Prueba flujo completo de transacción con tarjeta de crédito en Wompi',
    description:
      'Envia una solicitud de transacción con tarjeta de crédito haciendo el flujo completo, validar merchan, tokenizar tarjeta de crédito, crear transacción y obtener detalles de la transacción',
  })
  @ApiBody({ type: TestCreditCardFlowCreditCardTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({
    status: 502,
    description: 'Error en comunicación con Wompi',
  })
  async testingCreditCardWompiFlow(
    @Body() body: TestCreditCardFlowCreditCardTransactionDto,
  ) {
    return this.appService.testCreditCardWompiFlow(body);
  }
}
