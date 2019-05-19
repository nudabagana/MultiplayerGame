import express from 'express';
import * as dotenv from "dotenv";
import * as os from 'os';
import { createServer } from 'http';
import * as path from 'path';

dotenv.config();
const host = os.hostname();
if (!process.env.PORT){
  throw new Error(`PORT not Found! Please set it in environment variables.`);
}
const port = process.env.PORT;

const app = express();

app.use(express.static('dist'));

const server = createServer(app);

app.get('/',(req : express.Request, res : express.Response) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/favicon.ico',(req : express.Request, res : express.Response) => {
  res.sendFile(path.join(__dirname + '/../assets/favicon.png'));
});

server.listen(port, () => {
  console.log(`Server ready http://${host}:${port}`);
});