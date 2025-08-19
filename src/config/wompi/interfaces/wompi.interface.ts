export interface IWompiEndpointsV1 {
  getMerchantInfo: (publicKey: string) => string;
  createTokenizeCard: string;
  createTransactions: string;
  getTransactionInfoById: (transactionId: string) => string;
}

export interface IWompiConfig {
  url: string;
  publicKey: string;
  privateKey: string;
  integrityKey: string;
  endpoints: {
    v1: IWompiEndpointsV1;
  };
}
