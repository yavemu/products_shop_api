import { HttpException, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from '../';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = { status: mockStatus };
    mockRequest = { url: '/test-url', method: 'GET' };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should return proper error response with given exception', () => {
    const exception = new HttpException('Test error', 400);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/test-url',
        method: 'GET',
        message: 'Test error',
      }),
    );
  });

  it('should include timestamp in error response', () => {
    const exception = new HttpException('Another error', 500);

    filter.catch(exception, mockHost);

    const responseArg = mockJson.mock.calls[0][0];
    expect(responseArg.timestamp).toBeDefined();
    expect(typeof responseArg.timestamp).toBe('string');
  });
});
