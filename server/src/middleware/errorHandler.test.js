const errorHandler = require('./errorHandler');

describe('errorHandler', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let resJson;
    let resStatus;

    beforeEach(() => {
        resJson = jest.fn();
        resStatus = jest.fn();
        mockRequest = {};
        mockResponse = {
            status: resStatus,
            json: resJson,
        };
        mockNext = jest.fn();
        resJson.mockImplementation(() => mockResponse);
        resStatus.mockImplementation(() => mockResponse);
    });

    it('should return the error message and code', () => {
        const error = new Error('Error message');
        error.statusCode = 404;

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            msg: 'Error message',
        });
    });

    it('should return 500 by default if error statusCode is missing', () => {
        const error = new Error('Error message');

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            msg: 'Error message',
        });
    });

    it('should return a default http status message if error message is missing', () => {
        const error = new Error();

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            msg: 'HTTP_STATUS_INTERNAL_SERVER_ERROR',
        });
    });

    
    it('should call next if headers are already sent', () => {
        const error = new Error();
        mockResponse = {
            ...mockResponse,
            headersSent: true,
        }

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });
});