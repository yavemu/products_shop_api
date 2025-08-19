import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PayOrderDto } from './dto/pay-oder.dto';
import { PayOrderUseCase } from '../../../core/application/payments/payment-order.usecase';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly payOrder: PayOrderUseCase) {}

  @Post(':orderId')
  @ApiOperation({
    summary: 'Realiza el pago de una orden existente',
    description:
      'Crea un registro de transaccion en estado de proveedor de pago PENDING y estado de orden PROCCESING_PAY cuando el proveedor de pago acepte el pago',
  })
  async doOrderPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() payOrderDto: PayOrderDto,
  ) {
    return this.payOrder.execute({
      orderId,
      ...payOrderDto,
    });
  }
}
