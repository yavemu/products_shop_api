export interface ICreateOrder {
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  products: {
    id: number;
    quantity: number;
  }[];
}
