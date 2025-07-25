// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { OrderItem } from './order-item/entities/order-item.entity';
import { Order } from './order/entities/order.entity';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // hace que esté disponible en todos los módulos sin volver a importarlo
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434, // tu puerto personalizado
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce_db',
      entities: [User,OrderItem,Order,Product], // por ahora vacío, luego agregarás tus entidades aquí
      synchronize: true, // para desarrollo, crea/actualiza tablas automáticamente
    }),
    UserModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
    AuthModule,
    // aquí agregarás otros módulos luego
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
