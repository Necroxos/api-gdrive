import gdriveConnection from '../../../src/server/connection';

describe('GoogleDriveConnection', () => {

    it('createDriveClient', () => {
        const loadConfig = (gdriveConnection as any).appConfig;
        const connection = gdriveConnection.createDriveClient();

        const expectedConfig = {
            GDRIVE_CLIENT_ID: 'some-client-id',
            GDRIVE_CLIENT_SECRET: 'some-client-secret',
            GOOGLE_DRIVE_REDIRECT_URI: 'http://some-url.com/',
            GDRIVE_REFRESH_TOKEN: 'some-refresh-token'
        };

        const driveConfig = {
            GDRIVE_CLIENT_ID: loadConfig.GDRIVE_CLIENT_ID,
            GDRIVE_CLIENT_SECRET: loadConfig.GDRIVE_CLIENT_SECRET,
            GOOGLE_DRIVE_REDIRECT_URI: loadConfig.GOOGLE_DRIVE_REDIRECT_URI,
            GDRIVE_REFRESH_TOKEN: loadConfig.GDRIVE_REFRESH_TOKEN
        };

        expect(driveConfig).toEqual(expectedConfig);
        expect(connection).toBeDefined();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

});