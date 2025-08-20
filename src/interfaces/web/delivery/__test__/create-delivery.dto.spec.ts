import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from '../delivery.controller';
import { CreateDeliveryUseCase } from '../../../../core/application/deliveries/use-cases';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { Delivery } from '../../../../core/domain/deliveries/entities/delivery.entity';

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let createDeliveryUseCase: CreateDeliveryUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: CreateDeliveryUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
    createDeliveryUseCase = module.get<CreateDeliveryUseCase>(
      CreateDeliveryUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(createDeliveryUseCase).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateDeliveryUseCase with the provided dto and return a delivery', async () => {
      const dto: CreateDeliveryDto = {
        orderId: '123',
        address: 'Fake Street 123',
      } as CreateDeliveryDto;

      const delivery: Delivery = {
        id: '1',
        orderId: '123',
        address: 'Fake Street 123',
        status: 'pending',
      } as Delivery;

      (createDeliveryUseCase.execute as jest.Mock).mockResolvedValue(delivery);

      const result = await controller.create(dto);

      expect(createDeliveryUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(delivery);
    });

    it('should propagate errors thrown by CreateDeliveryUseCase', async () => {
      const dto: CreateDeliveryDto = {
        orderId: '123',
        address: 'Fake Street 123',
      } as CreateDeliveryDto;

      (createDeliveryUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(controller.create(dto)).rejects.toThrow('Unexpected error');
      expect(createDeliveryUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });
});
