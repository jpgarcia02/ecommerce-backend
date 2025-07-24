import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderItemDto } from 'src/order-item/dto/update-order-item.dto';

@Injectable()
export class OrderService {

  constructor(
      @InjectRepository(Order) private readonly  orderRepository: Repository<Order>,
      @InjectRepository(User) private readonly  UserRepository: Repository<User>
    ){}
  async create(createOrderDto: CreateOrderDto,userId:number) {
    const searchUser = await this.UserRepository.findOneBy({id: userId})
    if(!searchUser){
      throw new NotFoundException(`Usuario con el ID: ${userId} no encontardo`)
    }

    const newOrder = await this.orderRepository.create({
      user: searchUser
    })

    const savedOrder = await this.orderRepository.save(newOrder);
    return savedOrder;
  }

  async findAll() {
    return await this.orderRepository.find({relations:{user:true,orderItems:true}})
  }

  async findOne(id: number) {
    const searchOrder = await this.orderRepository.findOne({where:{id},relations:{user:true}})
    if(!searchOrder){
      throw new NotFoundException(`Orden con el ID: ${id} no encontardo`)
    }



    
    return searchOrder;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
  const searchOrder = await this.orderRepository.findOneBy({ id });

  if (!searchOrder) {
    throw new NotFoundException(`Orden con el ID: ${id} no encontrada`);
  }

  // Actualiza los campos manualmente
  const updatedO = this.orderRepository.merge(searchOrder, updateOrderDto as DeepPartial<Order>);

  // Guarda la orden actualizada
  const savedOrder = await this.orderRepository.save(updatedO);
  return savedOrder;
}

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
  throw new NotFoundException(`Orden con el ID: ${id} no encontrada`);
}
  const removed = await this.orderRepository.remove(order);
  return removed;

  }
}
