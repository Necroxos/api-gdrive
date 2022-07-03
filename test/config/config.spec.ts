import { ValidationError } from 'joi';
import loadConfig from '../../src/config';

describe('config', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    describe('loadConfig', () => {

        it('should return app config', () => {
            const result = loadConfig.appConfig();

            expect(result.NODE_ENV).toEqual('development');
            expect(result.PORT).toEqual(3000);
        });

        it('should error for invalid value for NODE_ENV', () => {
            process.env.NODE_ENV = 'test';

            try {
                loadConfig.appConfig();
            } catch (error: any) {
                const err = (error as ValidationError).details[0];
                expect(err.message).toEqual('"NODE_ENV" must be one of [development, production]');
            }
        });

        it('should error for invalid value for PORT', () => {
            process.env.PORT = 'test';

            try {
                loadConfig.appConfig();
            } catch (error: any) {
                const err = (error as ValidationError).details[0];
                expect(err.message).toEqual('"PORT" must be a number');
            }
        });

    });

    describe('loadDriveConfig', () => {

        it('should return google drive config', () => {
            const result = loadConfig.driveConfig();

            expect(result.GDRIVE_CLIENT_ID).toEqual('some-client-id');
            expect(result.GDRIVE_CLIENT_SECRET).toEqual('some-client-secret');
            expect(result.GOOGLE_DRIVE_REDIRECT_URI).toEqual('http://some-url.com/');
            expect(result.GDRIVE_REFRESH_TOKEN).toEqual('some-refresh-token');
        });

        it('should error for invalid value for GDRIVE_CLIENT_ID', () => {
            process.env.GDRIVE_CLIENT_ID = '';
            process.env.GDRIVE_CLIENT_SECRET = '';

            try {
                loadConfig.driveConfig();
            } catch (error: any) {
                const err = (error as ValidationError).details[0];
                expect(err.message).toEqual('"GDRIVE_CLIENT_ID" is not allowed to be empty');
            }
        });

    });
});