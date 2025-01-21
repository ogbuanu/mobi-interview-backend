import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RewardsService } from '../services/reward.service';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardsService) {}

  @Get('/balance')
  async getUserBalance(
    @Res() res: Response,
    @Query('userAddress') userAddress: string,
  ) {
    try {
      const result = await this.rewardService.getUserBalance(userAddress);
      return res
        .status(200)
        .json({ message: 'Balance fetched successfully', balance: result });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Post('/redeem')
  async redeemPoints(
    @Res() res: Response,
    @Body('userAddress') userAddress: string,
    @Body('points') points: number,
  ) {
    try {
      console.log({ userAddress, points });
      await this.rewardService.redeemPoints(userAddress, points);
      return res.status(200).json({ message: 'Points redeemed successfully' });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Get('/earn')
  async earnPoints(
    @Res() res: Response,
    @Query('userAddress') userAddress: string,
  ) {
    try {
      await this.rewardService.earnPoints(userAddress);
      return res.status(200).json({ message: 'Points earned successfully' });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
