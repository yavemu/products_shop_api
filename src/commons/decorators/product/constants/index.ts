import { Product } from '../../../../core/domain/products/entities/product.entity';

export const PRODUCTS_EXAMPLE: Product[] = [
  {
    id: 1,
    name: 'Essence Mascara Lash Princess',
    brand: 'Essence',
    description:
      'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.',
    stock: 48,
    price: 40959.0,
    tax: 19.0,
    totalPrice: 48741.21,
    mainImage:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
  {
    id: 2,
    name: 'Apple',
    brand: 'FreshFoods Co.',
    description:
      'Fresh and crisp apples, perfect for snacking or incorporating into various recipes.',
    stock: 80,
    price: 8200.0,
    tax: 5.0,
    totalPrice: 8610.0,
    mainImage:
      'https://cdn.dummyjson.com/product-images/groceries/apple/1.webp',
    thumbnail:
      'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp',
  },
];
