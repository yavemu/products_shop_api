export interface CreateCreditCardTransactionRequest {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: {
    type: 'CARD';
    token: string;
    installments: number;
  };
  reference: string;
  signature: string;
  acceptance_token: string;
}

export interface CreateCreditCardTransactionInput {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  acceptance_token: string;
  reference: string;
  payment_method: {
    token: string;
    installments: number;
  };
}

export interface CreateTransactionResponseData {
  id: string;
  created_at: string;
  finalized_at: string | null;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method: {
    type: string;
    extra: PaymentExtra;
    installments: number;
  };
  status: string;
  status_message: string | null;
  billing_data: BillingData;
  shipping_address: ShippingAddress;
  redirect_url: string | null;
  payment_source_id: string | null;
  payment_link_id: string | null;
  customer_data: CustomerData;
  bill_id: string | null;
  taxes: Tax[];
  tip_in_cents: number | null;
}

export interface PaymentExtra {
  bin: string;
  name: string;
  brand: string;
  exp_year: string;
  card_type: string;
  exp_month: string;
  last_four: string;
  card_holder: string;
  is_three_ds: boolean;
  three_ds_auth_type: string | null;
}

export type BillingData = any;
export type ShippingAddress = any;
export type CustomerData = any;
export type Tax = any;
