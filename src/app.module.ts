// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434, // tu puerto personalizado
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce_db',
      entities: [], // por ahora vacío, luego agregarás tus entidades aquí
      synchronize: true, // para desarrollo, crea/actualiza tablas automáticamente
    }),
    UserModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
    // aquí agregarás otros módulos luego
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
