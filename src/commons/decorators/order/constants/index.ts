import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm-entity';
import { Order } from '../../../../core/domain/orders/entities/order.entity';
import { OrderDetail } from '../../../../core/domain/orders/entities/order-detail.entity';
import { Product } from '../../../../core/domain/products/entities/product.entity';

export const ORDERS_EXAMPLE: Order[] = [
  {
    id: 1,
    customerName: 'María García',
    customerEmail: 'maria.garcia@email.com',
    customerPhone: '+57 301 234 5678',
    shippingAddress: 'Carrera 15 #32-45, Bogotá, Colombia',
    totalAmount: 40959.0,
    status: OrderStatusEnum.PENDING,
    createdAt: '2025-08-19T01:30:15.333Z' as unknown as Date,
    updatedAt: '2025-08-19T01:30:15.333Z' as unknown as Date,
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
    customerName: 'Juan Pérez',
    customerEmail: 'juan.perez@email.com',
    customerPhone: '+57 300 123 4567',
    shippingAddress: 'Calle 123, Medellín, Colombia',
    totalAmount: 143377.0,
    status: OrderStatusEnum.CONFIRMED,
    createdAt: '2025-08-19T02:39:15.333Z' as unknown as Date,
    updatedAt: '2025-08-19T02:39:15.333Z' as unknown as Date,
    orderDetails: [
      {
        id: 11,
        quantity: 2,
        unitPrice: 40959.0,
        totalPrice: 81918.0,
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
];
