import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { jwt } from './middlewares/JwtMiddleware';
import { InitializeRouter } from './Router';
import { JsonResponse } from './models/JsonResponse';
import ErrorHandler from './models/ErrorHandler';

export const boot = (controllers: any[], resolvers: any[], seedCallback?: any) => {
  const app = express();
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(jwt());

  InitializeRouter(controllers, app);

  app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, err.statusCode || 500, err.message);
    res.json(response);
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    const response = JsonResponse(false, 404, 'resource not found');
    res.json(response);
  });

  ((port = process.env.PORT || 5000) => {
    app.listen(port, () => console.log(`> Listening on port ${port}`));
  })();

  if (seedCallback) seedCallback();

  console.log('Server port: ', process.env.PORT);

  process.on('SIGINT', function () {
    process.exit(0);
  });
};
