export interface TokenizeCreditCardData {
  id: string;
  created_at: string;
  brand: string;
  name: string;
  last_four: string;
  bin: string;
  exp_year: string;
  exp_month: string;
  card_holder: string;
  created_with_cvc: boolean;
  expires_at: string;
  validity_ends_at: string;
}

export interface CreateTokenizeCreditCardInput {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
}
