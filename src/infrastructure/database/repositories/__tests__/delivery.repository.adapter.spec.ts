import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRepositoryAdapter } from '../delivery.repository.adapter';
import { Repository } from 'typeorm';
import { DeliveryOrmEntity } from '../../entities/delivery.orm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Delivery } from '../../../../core/domain/deliveries/entities/delivery.entity';

describe('DeliveryRepositoryAdapter', () => {
  let repository: DeliveryRepositoryAdapter;
  let ormRepository: jest.Mocked<Repository<DeliveryOrmEntity>>;

  const deliveryEntity: DeliveryOrmEntity = {
    id: 1,
    name: 'Test Delivery',
    trackingNumber: 'TRACK123',
    shippingAddress: '123 Street',
    fee: 10,
    status: 'pending',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryRepositoryAdapter,
        {
          provide: getRepositoryToken(DeliveryOrmEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<DeliveryRepositoryAdapter>(
      DeliveryRepositoryAdapter,
    );
    ormRepository = module.get(getRepositoryToken(DeliveryOrmEntity));
  });

  describe('create', () => {
    it('should create and save a delivery', async () => {
      ormRepository.create.mockReturnValue(deliveryEntity);
      ormRepository.save.mockResolvedValue(deliveryEntity);

      const result = await repository.create(
        deliveryEntity as unknown as Delivery,
      );

      expect(ormRepository.create).toHaveBeenCalledWith(deliveryEntity);
      expect(ormRepository.save).toHaveBeenCalledWith(deliveryEntity);
      expect(result).toEqual(
        expect.objectContaining({ id: 1, name: 'Test Delivery' }),
      );
    });
  });

  describe('findById', () => {
    it('should return a delivery when found', async () => {
      ormRepository.findOne.mockResolvedValue(deliveryEntity);

      const result = await repository.findById(1);

      expect(ormRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(
        expect.objectContaining({ id: 1, name: 'Test Delivery' }),
      );
    });

    it('should return null when not found', async () => {
      ormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated delivery', async () => {
      ormRepository.update.mockResolvedValue({ affected: 1 } as any);
      ormRepository.findOne.mockResolvedValue(deliveryEntity);

      const result = await repository.update(1, { name: 'Updated Delivery' });

      expect(ormRepository.update).toHaveBeenCalledWith(1, {
        name: 'Updated Delivery',
      });
      expect(result).toEqual(
        expect.objectContaining({ id: 1, name: 'Test Delivery' }),
      );
    });

    it('should throw error if delivery not found after update', async () => {
      ormRepository.update.mockResolvedValue({ affected: 1 } as any);
      ormRepository.findOne.mockResolvedValue(null);

      await expect(repository.update(1, { name: 'Not Found' })).rejects.toThrow(
        'Delivery not found',
      );
    });
  });
});
