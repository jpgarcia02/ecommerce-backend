
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id :number 

    @Column()
    quantity: number 

    @Column()
    price: number

    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product

    @ManyToOne(() => Order, (order) => order.orderItems)
    order: Order
    
}