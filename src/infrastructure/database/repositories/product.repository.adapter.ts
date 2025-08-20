import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductRepositoryPort } from '../../../core/domain/products/ports/product-repository.port';
import { Product } from '../../../core/domain/products/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { IProductFilter } from '../../../core/application/products/use-cases/interfaces/product-filder.interface';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = this.repository.create(product);
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findAll(filters?: IProductFilter): Promise<Product[]> {
    const where = {};
    if (filters?.ids && filters.ids.length > 0) {
      where['id'] = In(filters.ids);
    }

    return this.repository.find({ where });
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    const updatedProduct = await this.repository.findOne({ where: { id } });
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
