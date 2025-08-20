import { validate } from 'class-validator';
import { CreateDeliveryDto } from '../create-delivery.dto';
import { DeliveryStatusEnum } from '../../../../../core/domain/deliveries/enums/delivery-status.enum';

describe('CreateDeliveryDto', () => {
  it('should validate a valid delivery data', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty name', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = '';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with empty tracking number', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = '';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('trackingNumber');
  });

  it('should fail validation with empty address', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = '';
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('shippingAddress');
  });

  it('should fail validation with negative fee', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = -1000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('fee');
  });

  it('should fail validation with zero fee', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 0;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('fee');
  });

  it('should fail validation with invalid status', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 15000;
    dto.status = 'invalid-status' as DeliveryStatusEnum;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });

  it('should fail validation with name too long', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'a'.repeat(101);
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with tracking number too long', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'a'.repeat(101);
    dto.shippingAddress = 'Calle 123, Medellín, Colombia';
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('trackingNumber');
  });

  it('should fail validation with address too long', async () => {
    const dto = new CreateDeliveryDto();
    dto.name = 'Express Delivery';
    dto.trackingNumber = 'DHL123456789';
    dto.shippingAddress = 'a'.repeat(256);
    dto.fee = 15000;
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('shippingAddress');
  });
});