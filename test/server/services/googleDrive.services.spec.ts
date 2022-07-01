import fs from 'fs';
import driveService from '../../../src/server/services/googleDrive.service';
import gdriveConnection from '../../../src/server/drive/index';
import * as helpers from '../../../src/server/utils/helpers';

jest.mock('../../../src/config', () => ({
    loadDriveConfig: () => ({
        GDRIVE_CLIENT_ID: 'some-client-id',
        GDRIVE_CLIENT_SECRET: 'some-client-secret',
        GOOGLE_DRIVE_REDIRECT_URI: 'http://some-url.com/',
        GDRIVE_REFRESH_TOKEN: 'some-refresh-token'
    })
}));

jest.mock('random-useragent', () => ({
    getRandom: () => ('Random UA')
}));

const mockReadStream = { pipe: jest.fn() };
jest.mock('axios', () => ({
    get: () => ({ status: 200, data: mockReadStream })
}));

describe('GoogleDriveService', () => {
    const imgUrl = 'https://www.example-image.com/some-image.jpeg';
    const mangaName = 'Test manga';
    const chapter = 1;
    const createFileId = 'some-id';
    const imgName = 'image.jpg';
    const publicUrls = {
        webViewLink: 'http://www.drive.example.com/uc?id=createFileId&export=download',
        webContentLink: 'https://drive.example.com/file/d/createFileId/view?usp=drivesdk'
    };


    beforeEach(() => {
        fs.createWriteStream = jest.fn().mockImplementation(() => ({
            on: jest.fn()
        }));
        gdriveConnection.createDriveClient = jest.fn().mockImplementation(() => ({
            files: {
                create: jest.fn().mockImplementationOnce(() => ({
                    data: { id: createFileId, name: imgName }
                })),
                get: jest.fn().mockImplementationOnce(() => ({
                    data: publicUrls
                })),
                list: jest.fn().mockImplementationOnce(() => ({
                    data: {
                        files: [
                            { id: 'some-list-id', name: mangaName }
                        ]
                    }
                })).mockImplementationOnce(() => ({
                    data: {
                        files: [
                            { id: 'other-list-id', name: `Chapter ${chapter}` }
                        ]
                    }
                })),
            },
            permissions: { create: jest.fn() }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('downloadImage', () => {

        it('should return object with message "Imagen Descargada"', async () => {
            const expectedResponse = { message: 'Imagen Descargada' };

            const getImageSpy = jest.spyOn(driveService as any, 'getImage');
            const result = await driveService.downloadImage(imgUrl);

            expect(getImageSpy).toHaveBeenCalled();
            expect(fs.createWriteStream).toHaveBeenCalled();
            expect(mockReadStream.pipe).toBeCalledTimes(1);
            expect(result).toEqual(expectedResponse);
        });

    });

    describe('uploadImage', () => {
        it('should return object with drive file data', async () => {
            const expectedResponse = {
                message: 'Imagen Subida',
                data: {
                    id: createFileId,
                    name: imgName,
                    urls: publicUrls
                }
            };

            const capitalizeSpy = jest.spyOn(helpers, 'capitalizeAll');
            const getImageSpy = jest.spyOn(driveService as any, 'getImage');
            const publicUrlSpy = jest.spyOn(driveService as any, 'generatePublicUrl');

            const result = await driveService.uploadImage(imgUrl, mangaName, chapter);
            expect(getImageSpy).toHaveBeenCalled();
            expect(publicUrlSpy).toHaveBeenCalled();
            expect(capitalizeSpy).toHaveBeenCalled();
            expect(result).toEqual(expectedResponse);
        });
    });

});
