import { registerAs } from '@nestjs/config';

export default registerAs('wompi_config', () => ({
  url: process.env.WOMPI_API_URL || '',
  publicKey: process.env.WOMPI_PUBLIC_KEY || '',
  privateKey: process.env.WOMPI_PRIVATE_KEY || '',
  integrityKey: process.env.WOMPI_INTEGRITY_KEY || '',
  endpoints: {
    v1: {
      getMerchantInfo: (publicKey: string) =>
        `${process.env.WOMPI_API_URL}/v1/merchants/${publicKey}`,
      createTokenizeCard: `${process.env.WOMPI_API_URL}/v1/tokens/cards`,
      createTransactions: `${process.env.WOMPI_API_URL}/v1/transactions`,
      getTransactionInfoById: (transactionId: string) =>
        `${process.env.WOMPI_API_URL}/v1/transactions/${transactionId}`,
    },
  },
}));
