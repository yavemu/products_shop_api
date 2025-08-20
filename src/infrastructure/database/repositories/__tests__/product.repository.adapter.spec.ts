import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepositoryAdapter } from '../product.repository.adapter';
import { ProductOrmEntity } from '../../entities/product.orm-entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../../../core/domain/products/entities/product.entity';
import { IProductFilter } from '../../../../core/application/products/use-cases/interfaces/product-filder.interface';

describe('ProductRepositoryAdapter', () => {
  let repositoryAdapter: ProductRepositoryAdapter;
  let repository: jest.Mocked<Repository<ProductOrmEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepositoryAdapter,
        {
          provide: getRepositoryToken(ProductOrmEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    repositoryAdapter = module.get<ProductRepositoryAdapter>(
      ProductRepositoryAdapter,
    );
    repository = module.get(getRepositoryToken(ProductOrmEntity));
  });

  it('should save a product', async () => {
    const product: Product = { id: 1, name: 'Test Product' } as Product;
    const createdEntity = { ...product } as ProductOrmEntity;
    const savedEntity = { ...product } as ProductOrmEntity;

    repository.create.mockReturnValue(createdEntity);
    repository.save.mockResolvedValue(savedEntity);

    const result = await repositoryAdapter.save(product);

    expect(repository.create).toHaveBeenCalledWith(product);
    expect(repository.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toEqual(savedEntity);
  });

  it('should find all products without filters', async () => {
    const products = [{ id: 1, name: 'Prod1' }] as ProductOrmEntity[];
    repository.find.mockResolvedValue(products);

    const result = await repositoryAdapter.findAll();

    expect(repository.find).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual(products);
  });

  it('should find all products with ids filter', async () => {
    const products = [{ id: 1, name: 'Prod1' }] as ProductOrmEntity[];
    const filters: IProductFilter = { ids: [1] };

    repository.find.mockResolvedValue(products);

    const result = await repositoryAdapter.findAll(filters);

    expect(repository.find).toHaveBeenCalledWith({
      where: { id: expect.any(Object) }, // In([1])
    });
    expect(result).toEqual(products);
  });

  it('should find product by id', async () => {
    const product = { id: 1, name: 'Prod1' } as ProductOrmEntity;
    repository.findOne.mockResolvedValue(product);

    const result = await repositoryAdapter.findById(1);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(product);
  });

  it('should update a product and return it', async () => {
    const product = { id: 1, name: 'Updated Prod' } as ProductOrmEntity;
    repository.findOne.mockResolvedValue(product);

    const result = await repositoryAdapter.update(1, { name: 'Updated Prod' });

    expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated Prod' });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(product);
  });

  it('should throw error when updating non-existing product', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      repositoryAdapter.update(99, { name: 'NoProd' }),
    ).rejects.toThrow('Product not found');
  });

  it('should count products', async () => {
    repository.count.mockResolvedValue(5);

    const result = await repositoryAdapter.count();

    expect(repository.count).toHaveBeenCalled();
    expect(result).toBe(5);
  });
});
