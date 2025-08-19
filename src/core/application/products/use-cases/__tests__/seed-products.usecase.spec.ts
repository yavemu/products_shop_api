import { Test, TestingModule } from '@nestjs/testing';
import { SeedProductsUseCase } from '../seed-products.usecase';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../../../../core/domain/products/ports/product-repository.port';

describe('SeedProductsUseCase', () => {
  let useCase: SeedProductsUseCase;
  let repository: jest.Mocked<ProductRepositoryPort>;

  const productsData = [
    {
      id: 1,
      name: 'Smartphone X200',
      brand: 'TechBrand',
      description: 'Ultimate smartphone with AI camera and 8K video',
      stock: 50,
      price: 999.99,
      mainImage: 'https://example.com/images/x200-main.jpg',
      thumbnail: 'https://example.com/images/x200-thumb.jpg',
    },
    {
      id: 2,
      name: 'Laptop Pro 15',
      brand: 'CompTech',
      description: 'High performance laptop for developers',
      stock: 20,
      price: 1999.99,
      mainImage: 'https://example.com/images/laptop-main.jpg',
      thumbnail: 'https://example.com/images/laptop-thumb.jpg',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: {
            count: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<SeedProductsUseCase>(SeedProductsUseCase);
    repository = module.get(PRODUCT_REPOSITORY);
  });

  it('should save products when database is empty', async () => {
    repository.count.mockResolvedValue(0);
    repository.save.mockResolvedValue(undefined);

    await useCase.execute(productsData);

    expect(repository.count).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledTimes(productsData.length);
    expect(repository.save).toHaveBeenCalledWith(productsData[0]);
    expect(repository.save).toHaveBeenCalledWith(productsData[1]);
  });

  it('should throw an error if products already exist', async () => {
    repository.count.mockResolvedValue(5);

    await expect(useCase.execute(productsData)).rejects.toThrow(
      'Products already exist in database',
    );

    expect(repository.count).toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should propagate error if repository.save fails', async () => {
    repository.count.mockResolvedValue(0);
    repository.save.mockRejectedValue(new Error('DB Save Error'));

    await expect(useCase.execute(productsData)).rejects.toThrow(
      'DB Save Error',
    );
  });
});
