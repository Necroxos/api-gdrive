import { Router } from 'express';
import validate from '../middlewares/validate';
import driveController from '../controllers/googleDrive.controller';

class ProductRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/download', validate, driveController.downloadImage);
        this.router.get('/upload', validate, driveController.uploadImage);
    }
}

const productRoutes = new ProductRoutes();
export default productRoutes.router;