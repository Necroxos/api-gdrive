import { Router } from 'express';
import validate from '../middlewares/validate';
import driveController from '../controllers/googleDrive.controller';
import paramsValidator from '../middlewares/params-validate';

class ProductRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/download', paramsValidator.imageUrlValidationRule(), validate, driveController.downloadImage);
        this.router.get('/upload', paramsValidator.imageUrlValidationRule(), paramsValidator.folderValidationRules(),
            validate, driveController.uploadImage);
    }
}

const productRoutes = new ProductRoutes();
export default productRoutes.router;