import { validate } from 'class-validator';
import { UpdateDeliveryStatusDto } from '../dto/update-delivery-status.dto';
import { DeliveryStatusEnum } from '../../../../core/domain/deliveries/enums/delivery-status.enum';

describe('UpdateDeliveryStatusDto', () => {
  it('should validate a valid status update', async () => {
    const dto = new UpdateDeliveryStatusDto();
    dto.status = DeliveryStatusEnum.IN_TRANSIT;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with PENDING status', async () => {
    const dto = new UpdateDeliveryStatusDto();
    dto.status = DeliveryStatusEnum.PENDING;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with DELIVERED status', async () => {
    const dto = new UpdateDeliveryStatusDto();
    dto.status = DeliveryStatusEnum.DELIVERED;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with FAILED status', async () => {
    const dto = new UpdateDeliveryStatusDto();
    dto.status = DeliveryStatusEnum.FAILED;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid status', async () => {
    const dto = new UpdateDeliveryStatusDto();
    dto.status = 'invalid-status' as DeliveryStatusEnum;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });

  it('should fail validation with undefined status', async () => {
    const dto = new UpdateDeliveryStatusDto();

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });
});
