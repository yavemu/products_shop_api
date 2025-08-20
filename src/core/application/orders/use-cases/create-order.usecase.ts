import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
  CreateCustomerUseCase,
  GetCustomerByEmailUseCase,
} from '../../../application/customers/use-cases';
import {
  GetDeliveryByIdUseCase,
  UpdateDeliveryUseCase,
} from '../../../application/deliveries/use-cases';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerByEmailUseCase: GetCustomerByEmailUseCase,
    private readonly getDeliveryByIdUseCase: GetDeliveryByIdUseCase,
    private readonly updateDeliveryUseCase: UpdateDeliveryUseCase,
  ) {}

  async execute(createOrderDto: ICreateOrder): Promise<Order> {
    let totalAmount = 0;

    const productsId = [
      ...new Set(createOrderDto.products.map((item) => item.id)),
    ];

    // Buscar los productos
    const productsFound = await this.productRepository.findAll({
      ids: productsId,
    });

    if (productsFound.length !== productsId.length) {
      throw new BadRequestException('Uno o varios productos no fueron encontrados');
    }

    //Buscar customer si no existe entonces crearlo
    const customer = await this.findOrCreateCustomer(createOrderDto);

    // Buscar delivery
    const delivery = await this.getDeliveryByIdUseCase.execute(
      createOrderDto.deliveryId,
    );
    if (!delivery) {
      throw new BadRequestException('Delivery no encontrado');
    }

    // Si existe delivery, actualizar la dirección para estar seguro
    if (delivery.shippingAddress !== createOrderDto.shippingAddress) {
      await this.updateDeliveryUseCase.execute(createOrderDto.deliveryId, {
        shippingAddress: createOrderDto.shippingAddress,
      });
    }

    // Crear la orden como preorden sin detalles
    const newOrder = new Order();
    newOrder.customerId = customer.id as number;
    newOrder.deliveryId = delivery.id as number;
    newOrder.customerName = createOrderDto.customerName;
    newOrder.customerEmail = createOrderDto.customerEmail;
    newOrder.customerPhone = createOrderDto.customerPhone;
    newOrder.totalAmount = totalAmount;
    newOrder.status = OrderStatusEnum.PREORDENED;
    newOrder.orderDetails = [];

    // Guardar el detalle de orden y actualizar el stock
    for (const item of createOrderDto.products) {
      const orderDetail = new OrderDetail();

      // Consultar producto y validar stock disponible
      const product = productsFound.find((p) => p.id === item.id);
      if (!product) {
        throw new BadRequestException(`Producto con ID ${item.id} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para el producto ${product.name}. Stock disponible: ${product.stock}, cantidad solicitada: ${item.quantity}`);
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      orderDetail.productId = item.id;
      orderDetail.quantity = item.quantity;
      orderDetail.unitPrice = unitPrice;
      orderDetail.totalPrice = totalPrice;
      orderDetail.orderId = newOrder.id as number;

      newOrder.orderDetails.push(orderDetail);

      product.stock -= item.quantity;

      await this.productRepository.save(product);
    }

    // Actualizar el total de la orden y el estado y guardarla
    newOrder.totalAmount = totalAmount;
    newOrder.status = OrderStatusEnum.PENDING;
    const savedOrder = await this.repository.save(newOrder);

    if (!savedOrder) {
      throw new InternalServerErrorException('No se pudo guardar la orden');
    }

    const finalOrder = await this.repository.findById(savedOrder.id as number);
    if (!finalOrder) {
      throw new InternalServerErrorException('No se pudo recuperar la orden guardada');
    }
    return finalOrder;
  }

  async findOrCreateCustomer(createOrderDto: ICreateOrder) {
    const customer = await this.getCustomerByEmailUseCase.execute(
      createOrderDto.customerEmail,
    );

    if (customer) {
      return customer;
    }

    return this.createCustomerUseCase.execute({
      name: createOrderDto.customerName,
      email: createOrderDto.customerEmail,
      phone: createOrderDto.customerPhone || '',
    });
  }
}
