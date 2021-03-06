const {getSecret, storeSecret} = require('./secrets-controller');
const mockSecret = require("../db/secret"); 
const mockEncryption = require('../helpers/encrypt');
const mockDayjs = require('dayjs');

jest.mock('../db/secret');
jest.mock('../helpers/encrypt');
jest.mock('dayjs');

describe('secrets-controller', () => {
    describe('getSecret', () => {
        let mockRequest;
        let mockResponse;

        beforeEach(() => {
            mockRequest = {};
            mockResponse = {};
        });

        it('should return the secret that belongs to provided hash', async() => {
            const secretFromDB = {
                hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                secretText: '123abc',
                createdAt: '2021-02-10T09:36:12+01:00Z',
                remainingViews: 11,
                expiresAt: '2021-02-11T16:25:09.099+01:00',
                _id: "sdkjsjdfsd8f8882424",
                iv: 'iv',
            };
            mockSecret.mockReturnValue({
                getSecretByHash: () => secretFromDB,
                decreaseRemainingViews: () => 1,
            });
            mockDayjs.mockImplementation(() => ({
                isBefore: jest.fn().mockImplementation(() => false),
            }));
            mockEncryption.decrypt.mockReturnValue('password');
            const expectedSecret = {
                hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                secretText: 'password',
                createdAt: '2021-02-10T09:36:12+01:00Z',
                remainingViews: 10,
                expiresAt: '2021-02-11T16:25:09.099+01:00'
            };

            mockRequest = {
                params: {
                    hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                }
            };

            const result = await getSecret(mockRequest, mockResponse);

            expect(result).toEqual(expectedSecret);
        });

        it('should throw error if no secret with the provided hash is found', async() => {
            mockSecret.mockReturnValue({
                getSecretByHash: () => null,
            });

            mockRequest = {
                params: {
                    hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                }
            };
            await expect(getSecret(mockRequest, mockResponse))
            .rejects
            .toThrow('No secret with the provided hash 10f9407feac924df20be883c12a6ee889c0d7dd3 exists');
        });

        it('should throw error if secret is expired', async() => {
            const secretFromDB = {
                hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                secretText: '123abc',
                createdAt: '2021-02-10T09:36:12+01:00Z',
                remainingViews: 11,
                expiresAt: '2021-02-11T16:25:09.099+01:00',
                _id: "sdkjsjdfsd8f8882424",
                iv: 'iv',
            }
            mockSecret.mockReturnValue({
                getSecretByHash: () => secretFromDB,
            });
            mockDayjs.mockImplementation(() => ({
                isBefore: jest.fn().mockImplementation(() => true),
                
            }));
            mockRequest = {
                params: {
                    hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                }
            };

            await expect(getSecret(mockRequest, mockResponse))
            .rejects
            .toThrow('Secret 10f9407feac924df20be883c12a6ee889c0d7dd3 is expired, can no longer be viewed');
        });

        it('should throw error if maximum views have been exhausted', async() => {
            const secretFromDB = {
                hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                secretText: '123abc',
                createdAt: '2021-02-10T09:36:12+01:00Z',
                remainingViews: 0,
                expiresAt: '2021-02-11T16:25:09.099+01:00',
                _id: "sdkjsjdfsd8f8882424",
                iv: 'iv',
            }
            mockSecret.mockReturnValue({
                getSecretByHash: () => secretFromDB,
            });
            mockDayjs.mockImplementation(() => ({
                diff: jest.fn().mockImplementation(() => 1),
            }));
            mockRequest = {
                params: {
                    hash: '10f9407feac924df20be883c12a6ee889c0d7dd3',
                }
            };

            await expect(getSecret(mockRequest, mockResponse))
            .rejects
            .toThrow('Maximum views for secret 10f9407feac924df20be883c12a6ee889c0d7dd3 exhausted, no more views possible');
        });
    });

    describe('storeSecret', () => {
        let mockRequest;
        let mockResponse;

        beforeEach(() => {
            mockRequest = {};
            mockResponse = {};
        });

        it('should return the secret that was stored in db', async() => {
            mockSecret.mockReturnValue({
                insertSecret: () => 1,
            });
            mockAdd = jest.fn();
            mockAdd.mockReturnValue({
                format: () => '2021-02-11T16:25:09.099+01:00'
            })
            mockDayjs.mockImplementation(() => ({
                add: mockAdd,
                format: () => '2021-02-11T16:20:09.099+01:00',
            }));
            mockEncryption.encrypt.mockReturnValue({
                iv: 'iv',
                encryptedData: '123qwe',
            });
            const expectedSecret = {
                hash: expect.any(String),
                secretText: '1234',
                createdAt: '2021-02-11T16:20:09.099+01:00',
                remainingViews: 15,
                expiresAt: '2021-02-11T16:25:09.099+01:00'
            };

            mockRequest = {
                body: {
                    secret: "1234",
                    expireAfterViews: "15",
                    expireAfter: "5"
                }
            };

            const result = await storeSecret(mockRequest, mockResponse);

            expect(result).toEqual(expectedSecret);
        });

        it('should throw an error if required fields are missing', async() => {
            mockRequest = {
                body: {
                    expireAfter: "500"
                }
            };

            await expect(storeSecret(mockRequest, mockResponse))
            .rejects
            .toThrow('A secret and maximum view times must be provided in the request');
        });
    });
});