import { createWriteStream, ReadStream } from 'fs';
// DEPENDENCES
import axios from 'axios';
import randomUseragent from 'random-useragent';
import { drive_v3 } from 'googleapis';
// OWN IMPORTS
import gdriveConnection from '../connection';
import { PartialDriveFile, PartialDriveLink, PartialDriveUpload } from '../../interfaces/partial-drive';
import { capitalizeAll } from '../utils/helpers';

class GoogleDriveService {
    private folderId: string = '';
    private readonly DEAFULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

    /**
     * Generate a Http request for get image data
     * @param {string} url image original url
     * @returns {...} with the data of the image
     */
    private readonly getImage = async (url: string): Promise<any> => {
        const RANDOM_UA = randomUseragent.getRandom();
        const UA = RANDOM_UA || this.DEAFULT_UA;

        return axios.get(url, {
            responseType: 'stream',
            headers: { 'user-agent': UA }
        });
    };

    /**
     * Search id of folder on google drive
     * @param {drive_v3.Drive} service connection to google drive account
     * @param {string} folderName optional parameter with a sub folder name
     * @returns {PartialDriveFile} with the data of the image
     */
    private async searchFolder(service: drive_v3.Drive, folderName = 'Mangas', parentId?: string): Promise<PartialDriveFile | null> {
        const parent = parentId ? `and '${parentId}' in parents` : '';
        const { data } = await service.files.list({
            q: `mimeType='application/vnd.google-apps.folder'
                and name='${folderName}' and trashed = false
                ${parent}`,
            fields: 'files(id, name)',
        });

        return data.files ? data.files[0] as PartialDriveFile : null;
    }

    /**
     * Search id of folder on google drive
     * @param {drive_v3.Drive} service connection to google drive account
     * @param {string} mangaFolder manga folder were we should get or create chapter folder
     * @param {number} chapter episode to concat at chapter folder were we should upload images
     * @returns {string} with the google drive ID for the folder
     */
    private async searchFolderToUpload(service: drive_v3.Drive, mangaFolder: string, chapter: number): Promise<string> {
        mangaFolder = capitalizeAll(mangaFolder);
        const chapterFolder = `Chapter ${chapter}`;
        let folder: PartialDriveFile | null;
        let parentId: string;

        const containFolder = await this.searchFolder(service, mangaFolder);
        if (!containFolder) {
            const mainFolder = await this.searchFolder(service);
            const createdFolder = await this.createFolder(mangaFolder, service, mainFolder ? [mainFolder.id] : []);
            parentId = createdFolder.id;
        } else {
            parentId = containFolder.id;
        }

        const checkFolder = await this.searchFolder(service, chapterFolder, parentId);
        if (!checkFolder) {
            const newFolder = await this.createFolder(chapterFolder, service, [parentId]);
            folder = await this.searchFolder(service, newFolder.name);
        } else {
            folder = checkFolder;
        }

        return folder ? folder.id : '';
    }

    /**
     * Create one folder on google drive
     * @param {string} folderName chapter folder were we should upload images
     * @param {drive_v3.Drive} service connection to google drive account
     * @param {string[]} parentFolders folder id where we should nest the new folder
     * @returns {PartialDriveFile} with the google drive ID and name for the folder
     */
    private async createFolder(folderName: string, service: drive_v3.Drive, parentFolders?: string[]): Promise<PartialDriveFile> {
        const file = await service.files.create({
            requestBody: {
                name: folderName,
                parents: parentFolders,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id, name'
        });

        return file.data as PartialDriveFile;
    }

    /**
     * Get file by ID of google drive and set it public
     * Then get public url for view and download
     * @param {drive_v3.Drive} service connection to google drive account
     * @param {string} fileId Google drive ID for the file
     * @returns {any} with public links for view and download
     */
    private async generatePublicUrl(fileId: string, service: drive_v3.Drive): Promise<PartialDriveLink> {
        //change file permisions to public.
        await service.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        //obtain the webview and webcontent links
        const result = await service.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });

        return result.data as PartialDriveLink;
    }

    /**
     * Getting image from url with get request and save it on 'descargas/img.jpg' folder
     * @param {string} imageUrl image original url
     * @returns {...} with a message of success download
     */
    downloadImage = async (imageUrl: string): Promise<{ message: string }> => {
        const writer = createWriteStream(`${__dirname}/../../../descargas/img.jpg`);
        const response = await this.getImage(imageUrl);
        // Save file on local
        response.data.pipe(writer);
        writer.on('error', (err: any) => {
            writer.close();
            throw err;
        });
        return { message: 'Imagen Descargada' };
    };

    /**
     * Getting image from url with get request and save it on google drive
     * @param {string} imageUrl image original url
     * @param {string} mangaName name of manga for get or create folder
     * @param {string} chapter name of chapter for get or create folder
     * @returns {...} with a message of success upload and file data (id, name, links)
     */
    uploadImage = async (imageUrl: string, mangaName: string, chapter: number): Promise<PartialDriveUpload> => {
        const service = gdriveConnection.createDriveClient();
        this.folderId = this.folderId || await this.searchFolderToUpload(service, mangaName, chapter);

        const fileMetadata = {
            'name': 'manga.jpg',
            'parents': this.folderId ? [this.folderId] : [],
        };
        const media = {
            mimeType: 'image/jpeg',
            body: (await this.getImage(imageUrl)).data as ReadStream,
        };

        const file = await service.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name',
        });
        const publicImgUrl = await this.generatePublicUrl(file.data.id as string, service);

        return { message: 'Imagen Subida', data: { ...file.data, urls: publicImgUrl } } as PartialDriveUpload;
    };
}

const driveService = new GoogleDriveService();
export default driveService;
