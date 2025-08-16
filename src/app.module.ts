import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WompiModule } from './external_apis/wompi/wompi.module';
import externalApisConfig from './config/wompi/wompi.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [externalApisConfig] }),
    WompiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
