import { OrderItem } from "src/order-item/entities/order-item.entity";
import { Order } from "src/order/entities/order.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id :number 

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    price: number 

    @Column()
    stock : number

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];




}
