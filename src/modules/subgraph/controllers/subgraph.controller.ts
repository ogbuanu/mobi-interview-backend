import { Controller, Get, HttpException, Query, Res } from '@nestjs/common';
import { SubgraphService } from '../services/subgraph.service';
import { Response } from 'express';

@Controller('subgraph')
export class SubgraphController {
  constructor(private readonly subgraphService: SubgraphService) {}

  @Get('/')
  async getUserTransactions(
    @Res() res: Response,
    @Query('userAddress') userAddress: string,
  ) {
    try {
      const result =
        await this.subgraphService.getUserTransactions(userAddress);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
