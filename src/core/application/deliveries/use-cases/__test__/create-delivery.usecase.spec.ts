import { Test, TestingModule } from '@nestjs/testing';
import { CreateDeliveryUseCase } from '../create-delivery.usecase';
import {
  DELIVERY_REPOSITORY,
  DeliveryRepositoryPort,
} from '../../../../domain/deliveries/ports/delivery-repository.port';
import { Delivery } from '../../../../domain/deliveries/entities/delivery.entity';

describe('CreateDeliveryUseCase', () => {
  let useCase: CreateDeliveryUseCase;
  let repository: jest.Mocked<DeliveryRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDeliveryUseCase,
        {
          provide: DELIVERY_REPOSITORY,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateDeliveryUseCase>(CreateDeliveryUseCase);
    repository = module.get(DELIVERY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should call repository.create with data and return created delivery', async () => {
    const input: Delivery = {
      id: '1',
      orderId: 'order-123',
      address: 'Fake Street 123',
      status: 'pending',
    } as Delivery;
    const expected: Delivery = { ...input };

    repository.create.mockResolvedValue(expected);

    const result = await useCase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(expected);
  });

  it('should propagate errors from repository.create', async () => {
    const input: Delivery = {
      id: '1',
      orderId: 'order-123',
      address: 'Fake Street 123',
      status: 'pending',
    } as Delivery;

    repository.create.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(input)).rejects.toThrow('DB error');
    expect(repository.create).toHaveBeenCalledWith(input);
  });
});
