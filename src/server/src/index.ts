"use strict";
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { create as createMongoModule } from './db/mongo/mongo';
import { create as createCrud } from './db/mongo/crud';
import validator from "validator";
import { offerStatusEnum } from './types/offerStatus';
import { sendgridService } from './services/mail/sengrid-mail';
import { create as createOffersController } from './controllers/offersController';
import { create as createOfferContactController } from './controllers/offerContactController'
import { toOid, isStrOid } from './helpers/bson-oid';
import { LinksT } from './types/Links';
import { OfferContactT } from './types/OfferContact';
import * as logger from './logger/logger'

import dotenv from 'dotenv';
import { OfferT } from './types/Offer';

dotenv.config();

const port = process.env.PORT || 5000;
const sendGridApiKey = process.env.SENDGRID_API_KEY as string;

async function runServer() {
    const origin = "http://";
    const app: Express = express();
    app.use(express.json());
    app.use(cors({ /*origin: 'http://localhost:3000'*/ }));
    const dbCtxt = await createMongoModule().getDbCtxt();
    const mongoDbCrud = createCrud(dbCtxt);
    const MailService = sendgridService(sendGridApiKey);

    app.post('/offers/add-offer', async (req: Request, res: Response) => {
        const offer = req.body || {};
        const { companyName, email, adress, description, availabilityDate, expirationDate } = offer;

        if (!companyName) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :companyName is required " });
        }
        if (!validator.isAlphanumeric(companyName)) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect companyName " });
        }
        if (!email) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :email is required " });
        }
        if (!validator.isEmail(email)) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect email " });
        }
        if (!adress) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :adress is required " });
        }
        if (!description) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :description is required " });
        }
        offer.availabilityDate = new Date(availabilityDate);
        offer.expirationDate = new Date(expirationDate);
        offer.status = offerStatusEnum.pending;
        const offerData: OfferT = offer;
        // Will create offer in mongo db
        const addOfferRes = await mongoDbCrud.insertOne('offers', { data: offerData });
        // Will sending mail 
        if (addOfferRes.acknowledged) {
            const linksInfos = <LinksT>{ validationUrl: origin + req.headers.host + "/offers/validation/" + addOfferRes.insertedId.toString() }
            const offerMail = createOffersController().buildOfferMail(offerData, linksInfos);
            await MailService.sendMail(offerMail);
        }
        //Will return response
        return res.status(200).json({ ...addOfferRes, status: 200, message: "Offer successfully added!" });
    });

    app.get('/offers', async (req: Request, res: Response) => {
        const addOfferRes = await mongoDbCrud.find('offers', { "data.status": offerStatusEnum.active });
        return res.status(200).json({ ok: true, status: 200, data: addOfferRes })
    });

    app.get('/offers/:offerId', (req: Request, res: Response) => {
        (async () => {
            const offerId = req.params.offerId;
            if (!isStrOid(offerId)) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Invalid offer id` });
            }
            const offerObjectId = toOid(offerId);
            const concernedOffer = await mongoDbCrud.findOne('offers', { _id: offerObjectId, "data.status": offerStatusEnum.active });
            if (!concernedOffer._id) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Offer not found` });
            }
            return res.status(200).json({ ok: true, status: 200, data: { ...concernedOffer.data, id: concernedOffer._id }, message: 'Offer exist!' })
        })();
    });

    app.get('/offers/validation/:offerId', (req: Request, res: Response) => {
        (async () => {
            const offerId = req.params.offerId;
            const offerObjectId = toOid(offerId);
            // Will validate pending offer  to make status active
            const updateOfferRes = await mongoDbCrud.updateOne('offers', { _id: offerObjectId, "data.status": offerStatusEnum.pending }, { $set: { "data.status": offerStatusEnum.active } });
            if (updateOfferRes.acknowledged && updateOfferRes.modifiedCount === 0) {
                return res.status(400).send(`${offerId} :L’annonce a été déjà validée ou supprimée`);
            }
            return res.status(200).send(`L’annonce est validée! `);
        })();
    });

    app.post('/offers/contact', (req: Request, res: Response) => {
        (async () => {
            const offerContact = req.body || {};
            const { email, offerId } = offerContact;

            if (!email) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :email is required " });
            }
            if (!validator.isEmail(email)) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect email " });
            }

            if (!isStrOid(offerId)) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Invalid offer id` });
            }
            const offerObjectId = toOid(offerId);
            const concernedOffer = await mongoDbCrud.findOne('offers', { _id: offerObjectId });
            if (!concernedOffer._id) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Offer not found` });
            }
            offerContact.offerId = offerObjectId;
            const offerContactData: OfferContactT = offerContact;
            const concernedOfferData: OfferT = concernedOffer.data;
            const offerContactMail = createOfferContactController().buildOfferContactMail(offerContactData, concernedOfferData);
            await MailService.sendMail(offerContactMail);
            return res.status(200).json({ ok: true, status: 200, message: 'Mail sended!' })

        })();
    });

    // Start listening server 
    app.listen(port, () => logger.info(`Server has started on :${port}`));
}

runServer();