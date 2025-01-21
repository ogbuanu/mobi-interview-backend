import { Injectable } from '@nestjs/common';
import { request, gql } from 'graphql-request';

@Injectable()
export class SubgraphService {
  private readonly endpoint =
    'https://api.studio.thegraph.com/query/101723/reward-system-subgraph/version/latest';

  async getUserTransactions(userAddress: string): Promise<any> {
    const query = gql`
      query ($user: Bytes!) {
        userTransactions(where: { user: $user }) {
          id
          eventType
          points
          tokens
          timestamp
        }
      }
    `;
    return request(this.endpoint, query, { user: userAddress.toLowerCase() });
  }
}
