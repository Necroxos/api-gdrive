import driveService from '../../../src/server/services/googleDrive.service';
import fs from 'fs';

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

    // describe('uploadImage', () => {
    //     
    // });

});