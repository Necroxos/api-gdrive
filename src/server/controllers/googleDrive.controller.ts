import { Request, Response } from 'express';
import { EHttpStatusCode } from '../enums/EHttpStatusCode';
import driveService from '../services/googleDrive.service';

class GoogleDriveController {

    public downloadImage = async (req: Request, res: Response) => {
        try {
            let { imgUrl } = req.query;
            imgUrl = String(imgUrl);

            const image = await driveService.downloadImage(imgUrl);
            return res.status(EHttpStatusCode.Ok).json(image);

        } catch (error) {
            return res.status(EHttpStatusCode.InternalServerError).json(error);
        }
    };

    public uploadImage = async (req: Request, res: Response) => {
        try {
            let { imgUrl, mangaName, chapter } = req.query;
            imgUrl = String(imgUrl);
            mangaName = String(mangaName);
            const chapterNumber = Number(chapter);

            const image = await driveService.uploadImage(imgUrl, mangaName, chapterNumber);
            return res.status(EHttpStatusCode.Ok).json(image);

        } catch (error) {
            return res.status(EHttpStatusCode.InternalServerError).json(error);
        }
    };
}

const gdriveController = new GoogleDriveController();
export default gdriveController;
