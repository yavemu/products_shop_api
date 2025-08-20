import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig, wompiConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './infrastructure/modules/product.module';
import { OrderModule } from './infrastructure/modules/order.module';
import { TransactionModule } from './infrastructure/modules/transaction.module';
import { CustomerModule } from './infrastructure/modules/customer.module';
import { DeliveryModule } from './infrastructure/modules/delivery.module';
import { WompiModule } from './infrastructure/external_apis/wompi/wompi.module';
import { OrderDetailOrmEntity } from './infrastructure/database/entities/order-detail.orm.entity';
import { PaymentModule } from './infrastructure/modules/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [wompiConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        username: configService.getOrThrow<string>('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow<string>('database.name'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow<boolean>('database.synchronize'),
      }),
    }),

    WompiModule,
    ProductModule,
    OrderModule,
    OrderDetailOrmEntity,
    TransactionModule,
    PaymentModule,
    CustomerModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
