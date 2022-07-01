import { Router } from 'express';
import googleDriveRoutes from './googleDrive.routes';

class IndexRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.use('/gdrive', googleDriveRoutes);
    }
}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;
