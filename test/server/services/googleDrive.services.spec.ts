import fs from 'fs';
import driveService from '../../../src/server/services/googleDrive.service';

jest.mock('../../../src/config', () => ({
    loadDriveConfig: () => ({
        GDRIVE_CLIENT_ID: 'some-client-id',
        GDRIVE_CLIENT_SECRET: 'some-client-secret',
        GOOGLE_DRIVE_REDIRECT_URI: 'http://some-url.com/',
        GDRIVE_REFRESH_TOKEN: 'some-refresh-token'
    })
}));

describe('GoogleDriveService', () => {

    beforeEach(() => {
        fs.createWriteStream = jest.fn().mockImplementation(() => ({
            on: jest.fn()
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('downloadImage', () => {

        it('should return object with message "Imagen Descargada"', async () => {
            const imgUrl = 'https://www.example-image.com/some-image.jpeg';
            const expectedResponse = { message: 'Imagen Descargada' };

            const mockReadStream = { pipe: jest.fn() };
            const getImageSpy = jest.spyOn(driveService as any, 'getImage').mockResolvedValueOnce(
                { data: mockReadStream }
            );

            const result = await driveService.downloadImage(imgUrl);

            expect(getImageSpy).toHaveBeenCalled();
            expect(fs.createWriteStream).toHaveBeenCalled();
            expect(mockReadStream.pipe).toBeCalledTimes(1);
            expect(result).toEqual(expectedResponse);
        });

    });

    describe('uploadImage', () => {
        it('', () => {});
    });

});