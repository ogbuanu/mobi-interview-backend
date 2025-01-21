import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../services/token.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');

describe('TokenService', () => {
  let service: TokenService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchTokenPrice', () => {
    it('should fetch the token price successfully', async () => {
      const mockPrice = 12345.67;
      const mockApiKey = 'test-api-key';
      const mockResponse = {
        data: {
          tickers: [{ last: mockPrice }],
        },
      };

      mockConfigService.get.mockReturnValue(mockApiKey);
      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await service.fetchTokenPrice();

      expect(result).toEqual(mockPrice);
    });

    it('should throw an error if the API call fails', async () => {
      const mockApiKey = 'test-api-key';
      const errorMessage = 'Failed to fetch token price';

      mockConfigService.get.mockReturnValue(mockApiKey);
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.fetchTokenPrice()).rejects.toThrow(errorMessage);
    });
  });
});
