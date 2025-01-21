import { Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { TokenController } from './controllers/token.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [TokenController],
  providers: [TokenService, ConfigService],
})
export class TokenModule {}
