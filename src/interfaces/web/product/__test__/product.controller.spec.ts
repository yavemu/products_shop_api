import { Test, TestingModule } from '@nestjs/testing';
import {
  GetProductByIdUseCase,
  GetProductsUseCase,
} from '../../../../core/application/products/use-cases';
import { ProductController } from '../product.controller';
import { Product } from '../../../../core/domain/products/entities/product.entity';

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

describe('ProductController', () => {
  let controller: ProductController;
  let getProducts: jest.Mocked<GetProductsUseCase>;
  let getProductById: jest.Mocked<GetProductByIdUseCase>;

  beforeEach(async () => {
    getProducts = {
      execute: jest.fn().mockResolvedValue([ProductMock]),
    };

    getProductById = {
      execute: jest
        .fn()
        .mockImplementation((id: number) =>
          Promise.resolve({ ...ProductMock, id }),
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: GetProductsUseCase,
          useValue: getProducts,
        },
        {
          provide: GetProductByIdUseCase,
          useValue: getProductById,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['getProducts']).toBeDefined();
    expect(controller['getProductById']).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.getAll();

      expect(result).toEqual([ProductMock]);
      expect(getProducts.execute).toHaveBeenCalledTimes(1);
      expect(getProducts.execute).toHaveBeenCalledWith();
    });

    it('should return empty array if no products exist', async () => {
      getProducts.execute.mockResolvedValueOnce([]);
      const result = await controller.getAll();

      expect(result).toEqual([]);
    });

    it('should handle errors from use case', async () => {
      getProducts.execute.mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return a single product with correct structure', async () => {
      const testId = 1;
      const result = await controller.getById(testId);

      expect(result).toEqual({
        ...ProductMock,
        id: testId,
      });
      expect(getProductById.execute).toHaveBeenCalledWith(testId);
    });

    it('should call use case with provided id', async () => {
      const testId = 5;
      await controller.getById(testId);

      expect(getProductById.execute).toHaveBeenCalledWith(testId);
    });

    it('should throw if use case throws', async () => {
      getProductById.execute.mockRejectedValueOnce(
        new Error('Product not found'),
      );

      await expect(controller.getById(999)).rejects.toThrow(
        'Product not found',
      );
    });

    it('should validate product structure', async () => {
      const testId = 1;
      const result = await controller.getById(testId);

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        brand: expect.any(String),
        description: expect.any(String),
        stock: expect.any(Number),
        price: expect.any(Number),
        mainImage: expect.any(String),
        thumbnail: expect.any(String),
      });
    });
  });
});
