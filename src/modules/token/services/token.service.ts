import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}

  async fetchTokenPrice(): Promise<number> {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/bitcoin/tickers',
      {
        headers: {
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
        },
      },
    );
    console.log(response.data.tickers[0].last);
    return response.data.tickers[0].last;
  }
}
