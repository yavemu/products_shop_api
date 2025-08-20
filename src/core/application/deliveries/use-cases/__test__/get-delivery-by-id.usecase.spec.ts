import { Test, TestingModule } from '@nestjs/testing';
import { GetDeliveryByIdUseCase } from '../get-delivery-by-id.usecase';
import {
  DELIVERY_REPOSITORY,
  DeliveryRepositoryPort,
} from '../../../../domain/deliveries/ports/delivery-repository.port';
import { Delivery } from '../../../../domain/deliveries/entities/delivery.entity';

describe('GetDeliveryByIdUseCase', () => {
  let useCase: GetDeliveryByIdUseCase;
  let repository: jest.Mocked<DeliveryRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDeliveryByIdUseCase,
        {
          provide: DELIVERY_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetDeliveryByIdUseCase>(GetDeliveryByIdUseCase);
    repository = module.get(DELIVERY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return delivery when found', async () => {
    const delivery: Delivery = {
      id: 1,
      orderId: 'order-123',
      address: 'Fake Street 123',
      status: 'pending',
    } as Delivery;

    repository.findById.mockResolvedValue(delivery);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(delivery);
  });

  it('should return null when delivery not found', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });

  it('should propagate errors from repository.findById', async () => {
    repository.findById.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(1)).rejects.toThrow('DB error');
    expect(repository.findById).toHaveBeenCalledWith(1);
  });
});
