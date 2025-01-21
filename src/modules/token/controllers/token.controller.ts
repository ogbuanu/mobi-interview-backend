import { Controller, Get, HttpException, Res } from '@nestjs/common';
import { Response } from 'express';
import { TokenService } from '../services/token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('/fetch-price')
  async getPrice(@Res() res: Response) {
    try {
      const result = await this.tokenService.fetchTokenPrice();
      return res.status(200).json({ data: { name: 'Bitcoin', price: result } });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 400);
    }
  }
}
