import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from '../get-products.usecase';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../../../../core/domain/products/ports/product-repository.port';
import { Product } from '../../../../../core/domain/products/entities/product.entity';
import { IProductFilter } from '../interfaces/product-filder.interface';

const ProductMocks: Product[] = [
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

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let repository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
    repository = module.get(PRODUCT_REPOSITORY);
  });

  it('should return a list of products when repository has data', async () => {
    repository.findAll.mockResolvedValue(ProductMocks);

    const result = await useCase.execute();

    expect(result).toEqual(ProductMocks);
    expect(repository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should return an empty array when repository has no data', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(repository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should pass filters to the repository', async () => {
    const filters: IProductFilter = { brand: 'TechBrand' };
    repository.findAll.mockResolvedValue([ProductMocks[0]]);

    const result = await useCase.execute(filters);

    expect(result).toEqual([ProductMocks[0]]);
    expect(repository.findAll).toHaveBeenCalledWith(filters);
  });

  it('should throw if repository.findAll fails', async () => {
    repository.findAll.mockRejectedValue(new Error('DB Error'));

    await expect(useCase.execute()).rejects.toThrow('DB Error');
  });
});
