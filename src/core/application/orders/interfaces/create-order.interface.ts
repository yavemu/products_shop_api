export interface ICreateOrder {
  customerId: number;
  deliveryId: number;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  products: {
    id: number;
    quantity: number;
  }[];
}
