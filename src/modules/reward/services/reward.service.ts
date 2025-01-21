import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { abi } from '../../../abi/reward';
import { privateKey } from '../../../../secret.json';
@Injectable()
export class RewardsService {
  private readonly contractAddress =
    '0xD32AeaD07Ea50016b8777c78C0E19C0bb6C389bf';
  private readonly abi = abi;
  private readonly provider = new ethers.JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  );
  private readonly signer = new ethers.Wallet(`${privateKey}`, this.provider);
  private readonly contract: any = new ethers.Contract(
    this.contractAddress,
    this.abi,
    this.signer,
  );

  async getUserBalance(userAddress: string) {
    const result = await this.contract.checkBalance(userAddress);
    return Number(result);
  }

  async redeemPoints(userAddress: string, points: number) {
    const tx = await this.contract
      .connect(this.signer)
      .redeemPoints(userAddress, points);
    console.log(tx);
    await tx.wait();
  }
  async earnPoints(userAddress: string) {
    const tx = await this.contract.connect(this.signer).earn(userAddress);

    await tx.wait();
  }
}
