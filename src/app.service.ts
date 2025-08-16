import { Injectable, Logger } from '@nestjs/common';
import { WompiService } from './external_apis/wompi/wompi.service';
import {
  CreateCreditCardTransactionInput,
  TokenizeCreditCardData,
} from './external_apis/wompi/interfaces';
import { TestCreditCardFlowCreditCardTransactionDto } from './commons/dto/test-credit-card-complete-flow.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly wompiService: WompiService) {}

  async testCreditCardWompiFlow(
    body: TestCreditCardFlowCreditCardTransactionDto,
  ) {
    try {
      // 1. Obtener información del comerciante
      const merchantInfo = await this.wompiService.getMerchantInfo();

      // 2. Tokenizar tarjeta
      const tokenize: TokenizeCreditCardData =
        await this.wompiService.createTokenizeCreditCard({
          number: body.card_number,
          exp_month: body.exp_month,
          exp_year: body.exp_year,
          cvc: body.cvc,
          card_holder: body.card_holder,
        });

      // 3. Crear transacción con ese token
      const transactionInput: CreateCreditCardTransactionInput = {
        amount_in_cents: body.amount_in_cents,
        currency: body.currency,
        customer_email: body.customer_email,
        acceptance_token: merchantInfo.presigned_acceptance.acceptance_token,
        reference: `${body.reference}_${Date.now()}`,
        payment_method: {
          installments: body.installments,
          token: tokenize.id,
        },
      };
      const transaction =
        await this.wompiService.createCreditCardTransaction(transactionInput);

      // // 3. Obtener información de la transacción
      const transactionInfo = await this.wompiService.getTransactionInfo(
        transaction.id,
      );

      return { merchantInfo, tokenize, transaction, transactionInfo };
    } catch (error) {
      this.logger.error('Error en testWompiFlow', error);
      throw error;
    }
  }
}
