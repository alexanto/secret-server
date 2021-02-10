const logger = require('./logger');
jest.mock('dayjs', () => jest.fn().mockImplementation(() => ({
    format: jest.fn().mockImplementation(() => '2020-12-12 10:12:12'),
})));

describe('logger', () => {
    const originalLog = console.log;
    afterEach(() => (console.warn = originalLog));

    describe('logger output', () => {
        let consoleOutput = [];
        let mockRequest;
        let mockResponse;
        let mockNext;

        beforeEach(() => {
            reqGet = jest.fn();
            mockRequest = {
                protocol: 'http',
                get: reqGet,
                originalUrl: '/api/secret/10f9407feac924df20be883c12a6ee889c0d7dd3',
            };
            mockResponse = {};
            mockNext = jest.fn();
            reqGet.mockImplementation(() => 'localhost:8081');
            const mockedLog = output => consoleOutput.push(output)
            console.log = mockedLog;
        });
    
        it('should log requested endpoint with current date and call next', () => {
            logger(mockRequest, mockResponse, mockNext);
    
            expect(mockNext).toHaveBeenCalled();
            expect(consoleOutput).toEqual(['2020-12-12 10:12:12 http://localhost:8081/api/secret/10f9407feac924df20be883c12a6ee889c0d7dd3']);
        });
    });
});