export interface IPayOrderInput {
  orderId: number;
  deliveryAmount: number;
  deliveryName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  installments: number;
  cardHolder: string;
}
