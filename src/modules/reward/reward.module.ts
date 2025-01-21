import { Module } from '@nestjs/common';
import { RewardsService } from './services/reward.service';
import { RewardController } from './controllers/reward.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [RewardController],
  providers: [RewardsService, ConfigService],
})
export class RewardhModule {}
