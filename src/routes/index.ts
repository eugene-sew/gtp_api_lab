import { Router } from 'express';

import { labRouter } from '@routes/lab.routes';
const rootRouter = Router();

rootRouter.use('/lab', labRouter);

export { rootRouter };
