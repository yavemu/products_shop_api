import { Test, TestingModule } from '@nestjs/testing';
import { GetProductByIdUseCase } from '../get-product-by-id.usecase';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../../../../core/domain/products/ports/product-repository.port';
import { Product } from '../../../../..//core/domain/products/entities/product.entity';

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

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let repository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductByIdUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
    repository = module.get(PRODUCT_REPOSITORY);
  });

  it('should return a product if it exists', async () => {
    const product = ProductMock;
    repository.findById.mockResolvedValue(product);

    const result = await useCase.execute(1);

    expect(result).toEqual(product);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should return null if the product does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(result).toBeNull();
    expect(repository.findById).toHaveBeenCalledWith(999);
  });
});
