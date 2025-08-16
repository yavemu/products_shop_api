export interface WompiEndpointsV1 {
  getMerchantInfo: (publicKey: string) => string;
  createTokenizeCard: string;
  createTransactions: string;
  getTransactionInfo: (transactionId: string) => string;
}

export interface WompiConfig {
  url: string;
  publicKey: string;
  privateKey: string;
  integrityKey: string;
  endpoints: {
    v1: WompiEndpointsV1;
  };
}
