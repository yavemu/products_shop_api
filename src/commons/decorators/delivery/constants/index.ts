import { Delivery } from '../../../../core/domain/deliveries/entities/delivery.entity';
import { DeliveryStatusEnum } from '../../../../core/domain/deliveries/enums/delivery-status.enum';

export const DELIVERIES_EXAMPLE: Delivery[] = [
  {
    id: 1,
    name: 'Interrapidisimo',
    trackingNumber: 'ABC123456789',
    shippingAddress: 'Carrera 15 #32-45, Bogotá, Colombia',
    fee: 15000,
    status: DeliveryStatusEnum.PENDING,
  },
  {
    id: 2,
    name: 'DHL',
    trackingNumber: 'XXX123456789',
    shippingAddress: 'Calle 123, Medellín, Colombia',
    fee: 12000,
    status: DeliveryStatusEnum.IN_TRANSIT,
  },
];
