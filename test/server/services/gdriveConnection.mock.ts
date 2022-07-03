export const imgUrl = 'https://www.example-image.com/some-image.jpeg';
export const mangaName = 'Test manga';
export const chapter = 1;
export const createFileId = 'some-id';
export const imgName = 'image.jpg';
export const publicUrls = {
    webViewLink: 'http://www.drive.example.com/uc?id=createFileId&export=download',
    webContentLink: 'https://drive.example.com/file/d/createFileId/view?usp=drivesdk'
};

export const foundFolderToUpload = jest.fn().mockImplementation(() => ({
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

export const createFolderToUpload = jest.fn().mockImplementation(() => ({
    files: {
        create: jest.fn().mockImplementationOnce(() => ({
            data: { id: createFileId, name: mangaName }
        })).mockImplementationOnce(() => ({
            data: { id: 'other-list-id', name: `Chapter ${chapter}` }
        })).mockImplementationOnce(() => ({
            data: { id: createFileId, name: imgName }
        })),
        get: jest.fn().mockImplementationOnce(() => ({
            data: publicUrls
        })),
        list: jest.fn().mockImplementationOnce(() => ({
            data: { files: null }
        })).mockImplementationOnce(() => ({
            data: {
                files: [
                    { id: 'some-list-id', name: mangaName }
                ]
            }
        })).mockImplementationOnce(() => ({
            data: { files: null }
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