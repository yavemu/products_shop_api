export interface GetTransactionInfoResponse {
  data: TransactionData;
  [k: string]: any; // ignore other properties like meta: Record<string, any>
}

export interface TransactionData {
  id: string;
  created_at: string;
  amount_in_cents: number;
  reference: string;
  currency: string;
  payment_method_type: string;
  payment_method: PaymentMethod;
  redirect_url: string | null;
  status: string;
  status_message: string;
  merchant: Merchant;
  taxes: Tax[];
}

export interface PaymentMethod {
  type: string;
  extra: PaymentMethodExtra;
  installments: number;
}

export interface PaymentMethodExtra {
  name: string;
  brand: string;
  last_four: string;
  processor_response_code: string;
  [k: string]: any;
}

export interface Merchant {
  name: string;
  legal_name: string;
  contact_name: string;
  phone_number: string;
  logo_url: string | null;
  legal_id_type: string;
  email: string;
  legal_id: string;
}

export interface Tax {
  name?: string;
  amount_in_cents?: number;
}
