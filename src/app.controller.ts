import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTestCreditCardTransaction } from './commons/decorators/test-credit-card-complete-flow.decorator';
import { TestCreditCardFlowCreditCardTransactionDto } from './commons/dto/test-credit-card-complete-flow.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('run-credit-card-wompi-flow')
  @ApiTestCreditCardTransaction()
  async testingCreditCardWompiFlow(
    @Body() body: TestCreditCardFlowCreditCardTransactionDto,
  ) {
    return this.appService.testCreditCardWompiFlow(body);
  }
}
