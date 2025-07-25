import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private readonly  orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product) private readonly  productRepository: Repository<Product>,
    @InjectRepository(Order) private readonly  orderRepository: Repository<Order>
  ){}
  async create(createOrderItemDto: CreateOrderItemDto) {
  // 1. Buscar el producto
  const searchProduct = await this.productRepository.findOneBy({ id: createOrderItemDto.productId });
  if (!searchProduct) {
    throw new NotFoundException(`Producto con ID ${createOrderItemDto.productId} no encontrado`);
  }

  // 2. Verificar que hay stock suficiente
  if (searchProduct.stock < createOrderItemDto.quantity) {
    throw new BadRequestException(`No hay suficiente stock. Stock actual: ${searchProduct.stock}`);
  }

  // 3. Buscar la orden asociada
  const searchOrder = await this.orderRepository.findOneBy({ id: createOrderItemDto.orderId });
  if (!searchOrder) {
    throw new NotFoundException(`Orden con ID ${createOrderItemDto.orderId} no encontrada`);
  }

  // 4. Copiar el precio actual del producto
  createOrderItemDto.price = searchProduct.price;

  // 5. Restar el stock
  searchProduct.stock -= createOrderItemDto.quantity;
  await this.productRepository.save(searchProduct);

  // 6. Crear el OrderItem con relaciones
  const newOrderItem = this.orderItemRepository.create({
    quantity: createOrderItemDto.quantity,
    price: createOrderItemDto.price,
    product: searchProduct,
    order: searchOrder,
  });

  // 7. Guardar en base de datos
  const savedOrderItem = await this.orderItemRepository.save(newOrderItem);

  // 8. Retornar la respuesta
  return savedOrderItem;
}

    

  async findAll() {
    const searchOrder = await this.orderItemRepository.find({relations:['order','product']})
    return searchOrder ;
  }

  async findOne(id: number) {
    const searchOrder = await this.orderItemRepository.findOne({where:{id},relations:['order','product']})
    if (!searchOrder) {
    throw new NotFoundException(`Orden con ID ${id} no encontrada`);
  }

    return searchOrder;
  }
async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
  const searchOrder = await this.orderItemRepository.findOne({
    where: { id },
    relations: ['order', 'product'],
  });

  if (!searchOrder) {
    throw new NotFoundException(`Orden con ID ${id} no encontrado`);
  }

  // Si se cambia el producto
  if (updateOrderItemDto.productId) {
    const foundProduct = await this.productRepository.findOneBy({
      id: updateOrderItemDto.productId,
    });

    if (!foundProduct) {
      throw new NotFoundException(
        `Producto con ID ${updateOrderItemDto.productId} no encontrado`,
      );
    }

    searchOrder.product = foundProduct;
  }

  // Si se cambia la orden
  if (updateOrderItemDto.orderId) {
    const foundOrder = await this.orderRepository.findOneBy({
      id: updateOrderItemDto.orderId,
    });

    if (!foundOrder) {
      throw new NotFoundException(
        `Orden con ID ${updateOrderItemDto.orderId} no encontrado`,
      );
    }

    searchOrder.order = foundOrder;
  }

  // Si se cambia la cantidad
  if (updateOrderItemDto.quantity !== undefined) {
    const difference = updateOrderItemDto.quantity - searchOrder.quantity;

    // Si se incrementa la cantidad, hay que verificar el stock
    if (difference > 0) {
      if (searchOrder.product.stock < difference) {
        throw new NotFoundException('Stock insuficiente para actualizar cantidad');
      }

      searchOrder.product.stock -= difference;
    } else if (difference < 0) {
      // Si se reduce la cantidad, se devuelve al stock
      searchOrder.product.stock += Math.abs(difference);
    }

    searchOrder.quantity = updateOrderItemDto.quantity;
  }

  // Actualizar el precio si se desea
  if (updateOrderItemDto.price !== undefined) {
    searchOrder.price = updateOrderItemDto.price;
  }

  // Guardar los cambios en producto y en order item
  await this.productRepository.save(searchOrder.product);
  const updatedItem = await this.orderItemRepository.save(searchOrder);

  return updatedItem;
}


  

async remove(id: number) {
    const searchOrdenItem = await this.orderItemRepository.findOne({where:{id},relations:['product',]})
    if (!searchOrdenItem) {
    throw new NotFoundException(`OrdenItem con ID ${id} no encontrada`);
  };
  searchOrdenItem.product.stock += searchOrdenItem.quantity

  await this.productRepository.save(searchOrdenItem.product)

  await this.orderItemRepository.remove(searchOrdenItem)
  }
}

