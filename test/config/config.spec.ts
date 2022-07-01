import { ValidationError } from 'joi';
import { loadConfig, loadDriveConfig } from '../../src/config';

describe('config', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env.NODE_ENV = 'development';
        process.env.PORT = '3000';
        process.env.GDRIVE_API_KEY = 'some-api-key';
        process.env.GDRIVE_CLIENT_ID = 'some-client-id';
        process.env.GDRIVE_CLIENT_SECRET = 'some-client-secret';
        process.env.GOOGLE_DRIVE_REDIRECT_URI = 'http://some-url.com/';
        process.env.GDRIVE_REFRESH_TOKEN = 'some-refresh-token';
    });

    describe('loadConfig', () => {

        it('should return app config', () => {
            const result = loadConfig();

            expect(result.NODE_ENV).toEqual('development');
            expect(result.PORT).toEqual(3000);
        });

        it('should error for invalid value for NODE_ENV', () => {
            process.env.NODE_ENV = 'test';

            try {
                loadConfig();
            } catch (error: any) {
                const err = (error as ValidationError).details[0];
                expect(err.message).toEqual('"NODE_ENV" must be one of [development, production]');
            }
        });

        it('should error for invalid value for PORT', () => {
            process.env.PORT = 'test';

            try {
                loadConfig();
            } catch (error: any) {
                const err = (error as ValidationError).details[0];
                expect(err.message).toEqual('"PORT" must be a number');
            }
        });

    });

    describe('loadDriveConfig', () => {

        it('should return google drive config', () => {
            const result = loadDriveConfig();

            expect(result.GDRIVE_CLIENT_ID).toEqual('some-client-id');
            expect(result.GDRIVE_CLIENT_SECRET).toEqual('some-client-secret');
            expect(result.GOOGLE_DRIVE_REDIRECT_URI).toEqual('http://some-url.com/');
            expect(result.GDRIVE_REFRESH_TOKEN).toEqual('some-refresh-token');
        });

        it('should error for invalid value for GDRIVE_CLIENT_ID', () => {
            process.env.GDRIVE_CLIENT_ID = '';
            process.env.GDRIVE_CLIENT_SECRET = '';

            try {
                loadDriveConfig();
            } catch (error: any) {
                const err = (error as ValidationError).details[0];
                expect(err.message).toEqual('"GDRIVE_CLIENT_ID" is not allowed to be empty');
            }
        });

    });
});