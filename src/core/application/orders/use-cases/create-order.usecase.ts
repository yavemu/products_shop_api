import { Injectable, Inject } from '@nestjs/common';
import { Order } from '../../../domain/orders/entities/order.entity';
import { ORDER_REPOSITORY } from '../../../domain/orders/ports/order-repository.port';

import type { OrderRepositoryPort } from '../../../domain/orders/ports/order-repository.port';
import {
  PRODUCT_REPOSITORY,
  type ProductRepositoryPort,
} from '../../../domain/products/ports/product-repository.port';
import { OrderDetail } from '../../../domain/orders/entities/order-detail.entity';
import { OrderStatusEnum } from '../../../../infrastructure/database/entities/order.orm-entity';
import { ICreateOrder } from '../interfaces/create-order.interface';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../../domain/customers/ports/customer-repository.port';
import {
  DELIVERY_REPOSITORY,
  type DeliveryRepositoryPort,
} from '../../../domain/deliveries/ports/delivery-repository.port';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
  ) {}

  async execute(createOrderDto: ICreateOrder): Promise<Order | null> {
    let totalAmount = 0;

    const productsId = [
      ...new Set(createOrderDto.products.map((item) => item.id)),
    ];

    // Buscar los productos
    const productsFound = await this.productRepository.findAll({
      ids: productsId,
    });

    if (productsFound.length !== productsId.length) {
      throw new Error('Uno o varios productos no fueron encontrados');
    }

    //Buscar customer si no existe entonces crearlo
    const customer = await this.findOrCreateCustomer(createOrderDto);
    //crear delivery
    //PENDIENTE POR HACER => VALIDAR QUE EXISTA DELIVERY SI NO EXISTE RETORNA ERROR - SE REQUIERE PARA REALIZAR EL PAGO
    //const delivery = await this.deliveryRepository.create(createOrderDto);

    // Crear la orden como preorden sin detalles
    const newOrder = new Order();
    newOrder.customerId = customer.id as number;
    newOrder.deliveryId = createOrderDto.deliveryId; //Actualizar cuando se cree delivery o valide delivery
    newOrder.customerName = createOrderDto.customerName;
    newOrder.customerEmail = createOrderDto.customerEmail;
    newOrder.customerPhone = createOrderDto.customerPhone;
    newOrder.totalAmount = totalAmount;
    newOrder.status = OrderStatusEnum.PREORDENED;
    newOrder.orderDetails = [];

    // Guardar la orden preorden
    for (const item of createOrderDto.products) {
      const orderDetail = new OrderDetail();

      // Consultar producto y validar stock disponible
      const product = productsFound.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Producto con ID ${item.id} no encontrado`);
      }

      if (product.stock < item.quantity) {
        return null;
      }

      // Calcular precios
      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      // Crear detalle de orden
      orderDetail.productId = item.id;
      orderDetail.quantity = item.quantity;
      orderDetail.unitPrice = unitPrice;
      orderDetail.totalPrice = totalPrice;
      orderDetail.orderId = newOrder.id as number;

      // Guardar detalle de orden
      newOrder.orderDetails.push(orderDetail);

      // Actualizar stock
      product.stock -= item.quantity;

      await this.productRepository.save(product);
    }

    // Actualizar el total de la orden y el estado y guardarla
    newOrder.totalAmount = totalAmount;
    newOrder.status = OrderStatusEnum.PENDING;
    const savedOrder = await this.repository.save(newOrder);

    if (!savedOrder) {
      throw new Error('No se pudo guardar la orden');
    }

    return this.repository.findById(savedOrder.id as number);
  }

  async findOrCreateCustomer(createOrderDto: ICreateOrder) {
    const customer = await this.customerRepository.findByEmail(
      createOrderDto.customerEmail,
    );

    if (customer) {
      return customer;
    }

    return this.customerRepository.create({
      name: createOrderDto.customerName,
      email: createOrderDto.customerEmail,
      phone: createOrderDto.customerPhone || '',
    });
  }
}
