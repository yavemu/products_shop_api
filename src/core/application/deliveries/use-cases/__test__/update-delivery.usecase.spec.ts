import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDeliveryUseCase } from '../update-delivery.usecase';
import {
  DELIVERY_REPOSITORY,
  DeliveryRepositoryPort,
} from '../../../../domain/deliveries/ports/delivery-repository.port';
import { Delivery } from '../../../../domain/deliveries/entities/delivery.entity';

describe('UpdateDeliveryUseCase', () => {
  let useCase: UpdateDeliveryUseCase;
  let repository: jest.Mocked<DeliveryRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDeliveryUseCase,
        {
          provide: DELIVERY_REPOSITORY,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateDeliveryUseCase>(UpdateDeliveryUseCase);
    repository = module.get(DELIVERY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should update delivery and return updated entity', async () => {
    const delivery: Delivery = {
      id: 1,
      orderId: 'order-123',
      address: 'Old Street',
      status: 'pending',
    } as Delivery;

    const updatedDelivery: Delivery = {
      ...delivery,
      address: 'New Street 456',
      status: 'delivered',
    };

    repository.update.mockResolvedValue(updatedDelivery);

    const result = await useCase.execute(1, {
      address: 'New Street 456',
      status: 'delivered',
    });

    expect(repository.update).toHaveBeenCalledWith(1, {
      address: 'New Street 456',
      status: 'delivered',
    });
    expect(result).toEqual(updatedDelivery);
  });

  it('should throw if repository.update fails', async () => {
    repository.update.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(1, { status: 'canceled' })).rejects.toThrow(
      'DB error',
    );

    expect(repository.update).toHaveBeenCalledWith(1, { status: 'canceled' });
  });
});
