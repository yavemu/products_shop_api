import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from '../create-product.usecase';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../../../../core/domain/products/ports/product-repository.port';
import { Product } from '../../../../../core/domain/products/entities/product.entity';

const ProductMock: Product = {
  id: 1,
  name: 'Smartphone X200',
  brand: 'TechBrand',
  description: 'Ultimate smartphone with AI camera and 8K video',
  stock: 50,
  price: 999.99,
  mainImage: 'https://example.com/images/x200-main.jpg',
  thumbnail: 'https://example.com/images/x200-thumb.jpg',
};

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    repository = module.get(PRODUCT_REPOSITORY);
  });

  it('should save and return the created product', async () => {
    repository.save.mockResolvedValue(ProductMock);

    const result = await useCase.execute(ProductMock);

    expect(result).toEqual(ProductMock);
    expect(repository.save).toHaveBeenCalledWith(ProductMock);
  });

  it('should throw if repository.save fails', async () => {
    repository.save.mockRejectedValue(new Error('DB Error'));

    await expect(useCase.execute(ProductMock)).rejects.toThrow('DB Error');
    expect(repository.save).toHaveBeenCalledWith(ProductMock);
  });
});
