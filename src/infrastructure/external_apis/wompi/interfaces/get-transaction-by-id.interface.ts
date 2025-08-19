export interface GetTransactionInfoByIdResponse {
  id: string;
  created_at: string;
  amount_in_cents: number;
  reference: string;
  currency: string;
  payment_method_type: string;
  payment_method: GetTransactionInfoByIdPaymentMethod;
  redirect_url: string | null;
  status: string;
  status_message: string;
  merchant: GetTransactionInfoByIdMerchant;
  taxes: GetTransactionInfoByIdTax[];
}

export interface GetTransactionInfoByIdPaymentMethod {
  type: string;
  extra: GetTransactionInfoByIdPaymentMethodExtra;
  installments: number;
}

export interface GetTransactionInfoByIdPaymentMethodExtra {
  name: string;
  brand: string;
  last_four: string;
  processor_response_code: string;
  [k: string]: any;
}

export interface GetTransactionInfoByIdMerchant {
  name: string;
  legal_name: string;
  contact_name: string;
  phone_number: string;
  logo_url: string | null;
  legal_id_type: string;
  email: string;
  legal_id: string;
}

export interface GetTransactionInfoByIdTax {
  name?: string;
  amount_in_cents?: number;
}
