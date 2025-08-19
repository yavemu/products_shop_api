export interface IPayOrderInput {
  orderId: number;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  card_number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  installments: number;
  card_holder: string;
}
