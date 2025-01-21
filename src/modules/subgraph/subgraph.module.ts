import { Module } from '@nestjs/common';

import { SubgraphService } from './services/subgraph.service';
import { SubgraphController } from './controllers/subgraph.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [SubgraphController],
  providers: [SubgraphService, ConfigService],
})
export class SubgraphModule {}
