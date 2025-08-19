import { IProductFilter } from '../../../../core/application/products/use-cases/interfaces/product-filder.interface';
import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductRepositoryPort {
  save(product: Product): Promise<Product>;
  findAll(filters?: IProductFilter): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  count(): Promise<number>;
}
