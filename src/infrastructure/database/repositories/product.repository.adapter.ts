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
    // Excluir totalPrice del guardado en BD ya que es calculado
    const { totalPrice, ...productWithoutTotal } = product;
    const entity = this.repository.create(productWithoutTotal);
    const saved = await this.repository.save(entity);
    return this.calculateTotalPrice(saved);
  }

  async findAll(filters?: IProductFilter): Promise<Product[]> {
    const where = {};
    if (filters?.ids && filters.ids.length > 0) {
      where['id'] = In(filters.ids);
    }

    const products = await this.repository.find({ where });
    return products.map(product => this.calculateTotalPrice(product));
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.repository.findOne({ where: { id } });
    return product ? this.calculateTotalPrice(product) : null;
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    const updatedProduct = await this.repository.findOne({ where: { id } });
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return this.calculateTotalPrice(updatedProduct);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  private calculateTotalPrice(product: ProductOrmEntity): Product {
    const productWithTotal = product as Product;
    
    // Convertir a números para cálculos precisos
    const price = parseFloat(product.price.toString());
    const tax = parseFloat(product.tax.toString());
    
    // Calcular impuesto y total
    const taxAmount = price * (tax / 100);
    const totalPrice = price + taxAmount;
    
    // Redondear a 2 decimales
    productWithTotal.totalPrice = Math.round(totalPrice * 100) / 100;
    
    return productWithTotal;
  }
}
