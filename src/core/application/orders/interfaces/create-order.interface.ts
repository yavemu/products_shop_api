export interface ICreateOrder {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  products: {
    id: number;
    quantity: number;
  }[];
}
