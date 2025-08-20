import {
  Delivery,
  DeliveryStatusEnum,
} from '../../../../core/domain/deliveries/entities/delivery.entity';

export const DELIVERIES_EXAMPLE: Delivery[] = [
  {
    id: 1,
    trackingNumber: 'ABC123456789',
    deliveryAddress: 'Carrera 15 #32-45, Bogotá, Colombia',
    deliveryFee: 15000,
    status: DeliveryStatusEnum.PENDING,
  },
  {
    id: 2,
    trackingNumber: 'XXX123456789',
    deliveryAddress: 'Calle 123, Medellín, Colombia',
    deliveryFee: 12000,
    status: DeliveryStatusEnum.IN_TRANSIT,
  },
];
