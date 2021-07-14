import 'reflect-metadata';
import express from 'express';
import UserController from './UserController';
import TestController from './TestController';
import bodyParser from 'body-parser';
import { ExportData, InitializeRouter } from '../../RestServer';

const app = express();

const controllers = [UserController, TestController];

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello there!');
});

const exported = ExportData.getInstance();

InitializeRouter(controllers, app);

console.log(exported);

app.listen(3000, () => {
  console.log('Started express on port 3000');
});
