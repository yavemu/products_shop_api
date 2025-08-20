import { Order } from '../../../../../core/domain/orders/entities/order.entity';
import { GetOrderByIdUseCase } from '../get-order-by-id.usecase';
import { OrderStatusEnum } from '../../../../../infrastructure/database/entities/order.orm.entity';
const OrderMock: Order = {
  id: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  shippingAddress: '123 Street',
  totalAmount: 100,
  status: OrderStatusEnum.PENDING,
  orderDetails: [],
};

describe('GetOrderByIdUseCase', () => {
  let useCase: GetOrderByIdUseCase;
  let repository: { findById: jest.Mock };

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    };

    useCase = new GetOrderByIdUseCase(repository as any);
  });

  it('should return an order when found', async () => {
    repository.findById.mockResolvedValue(OrderMock);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(OrderMock);
  });

  it('should return null when order not found', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(repository.findById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });
});
