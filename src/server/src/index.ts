"use strict";
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { create as createMongoModule } from './db/mongo/mongo';
import { create as createCrud } from './db/mongo/crud';
import { sendgridService } from './services/mail/sengrid-mail';
import * as logger from './logger/logger'
import dotenv from 'dotenv';
import { offersRouteur } from './routes/offers';

dotenv.config();

const port = process.env.PORT || 5000;
const sendGridApiKey = process.env.SENDGRID_API_KEY as string;

async function runServer() {
 
    const app: Express = express();
    app.use(express.json());
    app.use(cors({ /*origin: 'http://localhost:3000'*/ }));
    const dbCtxt = await createMongoModule().getDbCtxt();
    const mongoDbCrud = createCrud(dbCtxt);
    const MailService = sendgridService(sendGridApiKey);
    app.use("/offers", offersRouteur(mongoDbCrud,MailService).router);
    // Start listening server 
    app.listen(port, () => logger.info(`Server has started on :${port}`));
}

runServer();