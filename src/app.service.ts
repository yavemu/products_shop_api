import { Injectable, Logger } from '@nestjs/common';
import { TestCreditCardFlowCreditCardTransactionDto } from './commons/dto/test-credit-card-complete-flow.dto';
import { WompiService } from './infrastructure/external_apis/wompi/wompi.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly wompiService: WompiService) {}

  async testCreditCardWompiFlow(
    body: TestCreditCardFlowCreditCardTransactionDto,
  ): Promise<any> {
    try {
      return this.wompiService.createPayWithCreditCardTransaction(body);
    } catch (error) {
      this.logger.error('Error en testWompiFlow', error);
      throw error;
    }
  }
}
