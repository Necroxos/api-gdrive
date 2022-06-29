import { Request, Response, Router } from 'express';
import indexRoutes from '../routes/routes';
import { EHttpStatusCode } from '../enums/EHttpStatusCode';

class API {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'Server activo',
                api: '/api'
            });
        });

        this.router.get('/api', (req: Request, res: Response) => {
            res.status(EHttpStatusCode.Ok).json({
                msg: 'API activa',
                image: '/api/gdrive',
                download: '/api/gdrive/download'
            });
        });

        this.router.use('/api', indexRoutes);

        this.router.all("*", (req: Request, res) => {
            res.status(EHttpStatusCode.NotFound).json({
                msg: "La solicitud no es reconocida por el servidor.",
            });
        });
    }
}

const apiRoutes = new API();
export default apiRoutes.router;