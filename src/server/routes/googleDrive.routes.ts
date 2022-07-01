import { Router } from 'express';
import validate from '../middlewares/validate';
import gdriveController from '../controllers/google-drive.controller';
import paramsValidator from '../middlewares/query-validate';

class GoogleDriveRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/download', paramsValidator.imageUrlValidationRule(), validate, gdriveController.downloadImage);
        this.router.get('/upload', paramsValidator.imageUrlValidationRule(), paramsValidator.folderValidationRules(),
            validate, gdriveController.uploadImage);
    }
}

const gdriveRoutes = new GoogleDriveRoutes();
export default gdriveRoutes.router;
