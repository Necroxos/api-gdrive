import fs from 'fs';
import driveService from '../../../src/server/services/googleDrive.service';
import gdriveConnection from '../../../src/server/connection';
import * as helpers from '../../../src/server/utils/helpers';
import { PartialDriveUpload } from '../../../src/interfaces/partial-drive';
import {
    imgUrl,
    mangaName,
    chapter,
    createFileId,
    imgName,
    publicUrls,
    createFolderToUpload,
    foundFolderToUpload
} from './gdriveConnection.mock';

jest.mock('random-useragent', () => ({
    getRandom: () => ('Random UA')
}));

const mockReadStream = { pipe: jest.fn() };
jest.mock('axios', () => ({
    get: () => ({ status: 200, data: mockReadStream })
}));

describe('GoogleDriveService', () => {

    describe('downloadImage', () => {
        fs.createWriteStream = jest.fn().mockImplementation(() => ({
            on: jest.fn()
        }));

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
        let capitalizeSpy: jest.SpyInstance;
        let getImageSpy: jest.SpyInstance;
        let publicUrlSpy: jest.SpyInstance;

        beforeEach(() => {
            capitalizeSpy = jest.spyOn(helpers, 'capitalizeAll');
            getImageSpy = jest.spyOn(driveService as any, 'getImage');
            publicUrlSpy = jest.spyOn(driveService as any, 'generatePublicUrl');
        });

        const expectedResponse = {
            message: 'Imagen Subida',
            data: {
                id: createFileId,
                name: imgName,
                urls: publicUrls
            }
        };

        const expectedResults = (
            getImageSpy: jest.SpyInstance,
            publicUrlSpy: jest.SpyInstance,
            result: PartialDriveUpload,
        ) => {
            expect(getImageSpy).toHaveBeenCalled();
            expect(publicUrlSpy).toHaveBeenCalled();
            expect(result).toEqual(expectedResponse);
        };

        it('should return object with drive file data and use searchFolderToUpload', async () => {
            gdriveConnection.createDriveClient = foundFolderToUpload;

            const result = await driveService.uploadImage(imgUrl, mangaName, chapter);
            expect(capitalizeSpy).toHaveBeenCalledTimes(1);
            expectedResults(getImageSpy, publicUrlSpy, result);
        });

        it('should return object with drive file data and use folderId variable', async () => {
            gdriveConnection.createDriveClient = foundFolderToUpload;

            const result = await driveService.uploadImage(imgUrl, mangaName, chapter);
            expect(capitalizeSpy).toHaveBeenCalledTimes(0);
            expectedResults(getImageSpy, publicUrlSpy, result);
        });

        it('should return object with drive file data and create manga folder at searchFolderToUpload', async () => {
            gdriveConnection.createDriveClient = createFolderToUpload;
            (driveService as any).folderId = '';

            const result = await driveService.uploadImage(imgUrl, mangaName, chapter);
            expect(capitalizeSpy).toHaveBeenCalledTimes(1);
            expectedResults(getImageSpy, publicUrlSpy, result);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

});
