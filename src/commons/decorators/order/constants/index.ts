import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm.entity';
import { Order } from '../../../../core/domain/orders/entities/order.entity';
import { OrderDetail } from '../../../../core/domain/orders/entities/order-detail.entity';
import { Product } from '../../../../core/domain/products/entities/product.entity';
import { Customer } from '../../../../core/domain/customers/entities/customer.entity';
import {
  Delivery,
  DeliveryStatusEnum,
} from '../../../../core/domain/deliveries/entities/delivery.entity';

export const ORDERS_EXAMPLE: Order[] = [
  {
    id: 1,
    customerId: 1,
    deliveryId: 1,
    customerName: 'María García',
    customerEmail: 'maria.garcia@email.com',
    customerPhone: '+57 301 234 5678',
    totalAmount: 40959.0,
    status: OrderStatusEnum.PENDING,
    createdAt: '2025-08-19T01:30:15.333Z' as unknown as Date,
    updatedAt: '2025-08-19T01:30:15.333Z' as unknown as Date,
    customer: {
      id: 1,
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+57 301 234 5678',
      createdAt: '2025-07-01T12:00:00.000Z' as unknown as Date,
      updatedAt: '2025-07-10T12:00:00.000Z' as unknown as Date,
    } as Customer,
    delivery: {
      id: 1,
      name: 'Carlos López',
      trackingNumber: 'XYZ-789',
      shippingAddress: 'Calle 123, Medellín, Colombia',
      fee: 50000,
      status: DeliveryStatusEnum.IN_TRANSIT,
      createdAt: '2025-07-05T09:30:00.000Z' as unknown as Date,
      updatedAt: '2025-07-12T09:30:00.000Z' as unknown as Date,
    } as Delivery,
    orderDetails: [
      {
        id: 10,
        quantity: 1,
        unitPrice: 40959.0,
        totalPrice: 40959.0,
        product: {
          id: 1,
          name: 'Essence Mascara Lash Princess',
          brand: 'Essence',
          description:
            'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.',
          stock: 48,
          price: 40959.0,
          mainImage:
            'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
          thumbnail:
            'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
        } as Product,
      },
    ] as unknown as OrderDetail[],
  },
  {
    id: 2,
    customerId: 2,
    deliveryId: 2,
    customerName: 'Juan Pérez',
    customerEmail: 'juan.perez@email.com',
    customerPhone: '+57 302 555 1212',
    totalAmount: 120000.0,
    status: OrderStatusEnum.SHIPPED,
    createdAt: '2025-08-18T15:45:10.000Z' as unknown as Date,
    updatedAt: '2025-08-19T09:15:20.000Z' as unknown as Date,
    customer: {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+57 302 555 1212',
      createdAt: '2025-06-20T11:30:00.000Z' as unknown as Date,
      updatedAt: '2025-07-25T14:00:00.000Z' as unknown as Date,
    } as Customer,
    delivery: {
      id: 2,
      name: 'Laura Fernández',
      trackingNumber: 'XYZ-789',
      shippingAddress: 'Calle 123, Medellín, Colombia',
      fee: 50000,
      status: DeliveryStatusEnum.IN_TRANSIT,
      createdAt: '2025-07-08T08:00:00.000Z' as unknown as Date,
      updatedAt: '2025-07-20T10:00:00.000Z' as unknown as Date,
    } as Delivery,
    orderDetails: [
      {
        id: 20,
        quantity: 2,
        unitPrice: 60000.0,
        totalPrice: 120000.0,
        product: {
          id: 2,
          name: 'iPhone 15 Pro',
          brand: 'Apple',
          description:
            'The latest Apple iPhone 15 Pro with A17 chip, titanium design, and advanced camera system.',
          stock: 15,
          price: 60000.0,
          mainImage:
            'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro/1.webp',
          thumbnail:
            'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro/thumbnail.webp',
        } as Product,
      },
    ] as unknown as OrderDetail[],
  },
];
