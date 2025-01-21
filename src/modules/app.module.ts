import { Module } from '@nestjs/common';
import { SubgraphModule } from './subgraph/subgraph.module';
import { RewardhModule } from './reward/reward.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [SubgraphModule, RewardhModule, TokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
