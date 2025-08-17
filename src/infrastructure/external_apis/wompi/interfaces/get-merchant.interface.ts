export interface MerchantResponse {
  data: MerchantData;
  [k: string]: any;
}

export interface MerchantData {
  id: number;
  name: string;
  email: string;
  contact_name: string;
  phone_number: string;
  active: boolean;
  logo_url: string | null;
  legal_name: string;
  legal_id_type: string;
  legal_id: string;
  public_key: string;
  accepted_currencies: string[];
  fraud_javascript_key: string | null;
  fraud_groups: any[];
  accepted_payment_methods: string[];
  payment_methods: PaymentMethod[];
  presigned_acceptance: PresignedAcceptance;
  presigned_personal_data_auth: PresignedAcceptance;
  click_to_pay_dpa_id: string | null;
  mcc: string | null;
  acquirer_id: string | null;
}

export interface PaymentMethod {
  name: string;
  payment_processors: PaymentProcessor[];
}

export interface PaymentProcessor {
  name: string;
}

export interface PresignedAcceptance {
  acceptance_token: string;
  permalink: string;
  type: string;
}
