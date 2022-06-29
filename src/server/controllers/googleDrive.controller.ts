import { Request, Response } from 'express';
import { EHttpStatusCode } from '../enums/EHttpStatusCode';
import driveService from '../services/googleDrive.service';

class GoogleDriveController {

    public downloadImage = async (req: Request, res: Response) => {
        try {
            let { imgUrl } = req.query;
            imgUrl = !!imgUrl ? String(imgUrl) : '';

            const image = await driveService.downloadFile(imgUrl);
            return res.status(EHttpStatusCode.Ok).json(image);

        } catch (error) {
            return res.status(EHttpStatusCode.InternalServerError).json(error);
        }
    };

    public uploadImage = async (req: Request, res: Response) => {
        try {
            let { imgUrl, mangaName, chapter } = req.query;
            imgUrl = !!imgUrl ? String(imgUrl) : '';
            mangaName = !!mangaName ? String(mangaName) : '';
            chapter = !!chapter ? String(chapter) : '';

            const image = await driveService.uploadImage(imgUrl, mangaName, chapter);
            return res.status(EHttpStatusCode.Ok).json(image);

        } catch (error) {
            return res.status(EHttpStatusCode.InternalServerError).json(error);
        }
    };
}

const driveController = new GoogleDriveController();
export default driveController;