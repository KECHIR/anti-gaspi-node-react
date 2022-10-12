"use strict";
import express from 'express';
import cors from 'cors';
import { create as createMongoModule } from './db/mongo/mongo';
import { create as createCrud } from './db/mongo/crud';
import validator from "validator";
import { offerStatusEnum } from './types/offerStatus';

const port = process.env.PORT || 5000;

async function runServer() {
    const app = express();
    app.use(express.json());
    app.use(cors({ /*origin: 'http://localhost:3000'*/ }));
    const dbCtxt = await createMongoModule().getDbCtxt();
    const mongoDbCrud = createCrud(dbCtxt);

    app.post('/offers/add-offer', async (req, res) => {

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
        const addOfferRes = mongoDbCrud.insert('offers', { data: offer });
        return res.status(200).json({ ...addOfferRes, status: 200, message: "Offer successfully added!" });
    });

    // Start listening server 
    app.listen(port, () => console.log(`Server has started on :${port}`));
}

runServer();