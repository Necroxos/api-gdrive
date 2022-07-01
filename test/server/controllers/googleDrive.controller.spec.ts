import driveController from '../../../src/server/controllers/googleDrive.controller';
import driveService from '../../../src/server/services/googleDrive.service';
import { EHttpStatusCode } from '../../../src/server/enums/EHttpStatusCode';

jest.mock('../../../src/config');

describe('GoogleDriveController', () => {
    let jsonSpy: any;
    let statusSpy: any;
    let responseParam: any;

    beforeEach(() => {
        jsonSpy = jest.fn().mockReturnValueOnce({});
        statusSpy = jest.fn().mockReturnValueOnce({ json: jsonSpy });
        responseParam = { status: statusSpy };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('downloadImage', () => {

        it('should get and image for download', async () => {
            const expectedResponse = { message: 'Imagen Descargada' };
            const requestParam: any = { query: { imgUrl: 'https://www.example-image.com/some-image.jpeg' } };
            const downloadSpy = jest.spyOn(driveService, 'downloadImage').mockResolvedValueOnce(expectedResponse);
            await driveController.downloadImage(requestParam, responseParam);

            const { imgUrl } = requestParam.query;

            expect(downloadSpy).toHaveBeenCalled();
            expect(downloadSpy).toHaveBeenCalledWith(imgUrl);
            expect(jsonSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(expectedResponse);
            expect(statusSpy).toHaveBeenCalled();
            expect(statusSpy).toHaveBeenCalledWith(EHttpStatusCode.Ok);
        });

        it('should return error for invalid param when try download image', async () => {
            const requestParam: any = { query: { imgUrl: 'http://invalid-url' } };
            const expectedResponse: any = {
                errors: [
                    {
                        value: 'http://invalid-url',
                        msg: 'Invalid value',
                        param: 'imgUrl',
                        location: 'query'
                    }
                ]
            };
            const getProductsSpy = jest.spyOn(driveService, 'downloadImage').mockResolvedValueOnce(expectedResponse);
            await driveController.downloadImage(requestParam, responseParam);

            expect(getProductsSpy).toHaveBeenCalled();
            expect(getProductsSpy).toHaveBeenCalledWith(requestParam.query.imgUrl);
            expect(jsonSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(expectedResponse);
            expect(statusSpy).toHaveBeenCalled();
        });

        it('should get throw error when try download image', async () => {
            const requestParam: any = { query: {} };
            const errorResponse = new Error('Error test');
            const downloadSpy = jest.spyOn(driveService, 'downloadImage').mockImplementationOnce(() => {
                throw errorResponse;
            });
            await driveController.downloadImage(requestParam, responseParam);

            expect(downloadSpy).toHaveBeenCalled();
            expect(downloadSpy).toHaveBeenCalledWith('undefined');
            expect(jsonSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(errorResponse);
            expect(statusSpy).toHaveBeenCalled();
            expect(statusSpy).toHaveBeenCalledWith(EHttpStatusCode.InternalServerError);
        });
    });

    describe('uploadImage', () => {

        it('should get and image and upload to gdrive', async () => {
            const requestParam: any = {
                query: {
                    imgUrl: 'https://www.example-image.com/some-image.jpeg',
                    mangaName: 'manga',
                    chapter: 1
                }
            };
            const expectedResponse = {
                message: 'Imagen Subida',
                data: {
                    id: 'some-id',
                    name: 'manga.jpg',
                    urls: {
                        webContentLink: 'https://drive.google.com/uc?id=some-id&export=download',
                        webViewLink: 'https://drive.google.com/file/d/some-id/view?usp=drivesdk'
                    }
                }
            };
            const uploadSpy = jest.spyOn(driveService, 'uploadImage').mockResolvedValueOnce(expectedResponse);
            await driveController.uploadImage(requestParam, responseParam);

            const { imgUrl, mangaName, chapter } = requestParam.query;

            expect(uploadSpy).toHaveBeenCalled();
            expect(uploadSpy).toHaveBeenCalledWith(imgUrl, mangaName, chapter);
            expect(jsonSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(expectedResponse);
            expect(statusSpy).toHaveBeenCalled();
            expect(statusSpy).toHaveBeenCalledWith(EHttpStatusCode.Ok);
        });

        it('should return error for param type', async () => {
            const requestParam: any = {
                query: {
                    imgUrl: 'https://www.example-image.com/some-image.jpeg',
                    mangaName: 'manga',
                    chapter: 'chapter 1'
                }
            };
            const expectedResponse: any = {
                errors: [
                    {
                        value: 'chapter 1',
                        msg: 'Invalid value',
                        param: 'chapter',
                        location: 'query'
                    }
                ]
            };
            const uploadImageSpy = jest.spyOn(driveService, 'uploadImage').mockResolvedValueOnce(expectedResponse);
            await driveController.uploadImage(requestParam, responseParam);

            const { imgUrl, mangaName } = requestParam.query;

            expect(uploadImageSpy).toHaveBeenCalled();
            expect(uploadImageSpy).toHaveBeenCalledWith(imgUrl, mangaName, NaN);
            expect(jsonSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(expectedResponse);
            expect(statusSpy).toHaveBeenCalled();
        });

        it('should get throw error when try upload an image', async () => {
            const requestParam: any = {
                query: {
                    imgUrl: 'https://www.example-image.com/some-image.jpeg',
                    mangaName: 'manga',
                    chapter: 1
                }
            };
            const errorResponse = new Error('Error test');
            const uploadSpy = jest.spyOn(driveService, 'uploadImage').mockImplementationOnce(() => {
                throw errorResponse;
            });
            await driveController.uploadImage(requestParam, responseParam);

            const { imgUrl, mangaName, chapter } = requestParam.query;

            expect(uploadSpy).toHaveBeenCalled();
            expect(uploadSpy).toHaveBeenCalledWith(imgUrl, mangaName, chapter);
            expect(jsonSpy).toHaveBeenCalled();
            expect(jsonSpy).toHaveBeenCalledWith(errorResponse);
            expect(statusSpy).toHaveBeenCalled();
            expect(statusSpy).toHaveBeenCalledWith(EHttpStatusCode.InternalServerError);
        });
    });

});