"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongo_1 = require("./db/mongo/mongo");
const crud_1 = require("./db/mongo/crud");
const validator_1 = __importDefault(require("validator"));
const offerStatus_1 = require("./types/offerStatus");
const sengrid_mail_1 = require("./services/mail/sengrid-mail");
const offersController_1 = require("./controllers/offersController");
const offerContactController_1 = require("./controllers/offerContactController");
const bson_oid_1 = require("./helpers/bson-oid");
const logger = __importStar(require("./logger/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const sendGridApiKey = process.env.SENDGRID_API_KEY;
async function runServer() {
    const origin = "http://";
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({ /*origin: 'http://localhost:3000'*/}));
    const dbCtxt = await (0, mongo_1.create)().getDbCtxt();
    const mongoDbCrud = (0, crud_1.create)(dbCtxt);
    const MailService = (0, sengrid_mail_1.sendgridService)(sendGridApiKey);
    app.post('/offers/add-offer', async (req, res) => {
        const offer = req.body || {};
        const { companyName, email, adress, description, availabilityDate, expirationDate } = offer;
        if (!companyName) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :companyName is required " });
        }
        if (!validator_1.default.isAlphanumeric(companyName)) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect companyName " });
        }
        if (!email) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :email is required " });
        }
        if (!validator_1.default.isEmail(email)) {
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
        offer.status = offerStatus_1.offerStatusEnum.pending;
        const offerData = offer;
        // Will create offer in mongo db
        const addOfferRes = await mongoDbCrud.insertOne('offers', { data: offerData });
        // Will sending mail 
        if (addOfferRes.acknowledged) {
            const linksInfos = { validationUrl: origin + req.headers.host + "/offers/validation/" + addOfferRes.insertedId.toString() };
            const offerMail = (0, offersController_1.create)().buildOfferMail(offerData, linksInfos);
            await MailService.sendMail(offerMail);
        }
        //Will return response
        return res.status(200).json(Object.assign(Object.assign({}, addOfferRes), { status: 200, message: "Offer successfully added!" }));
    });
    app.get('/offers', async (req, res) => {
        const addOfferRes = await mongoDbCrud.find('offers', { "data.status": offerStatus_1.offerStatusEnum.active });
        return res.status(200).json({ ok: true, status: 200, data: addOfferRes });
    });
    app.get('/offers/:offerId', (req, res) => {
        (async () => {
            const offerId = req.params.offerId;
            if (!(0, bson_oid_1.isStrOid)(offerId)) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Invalid offer id` });
            }
            const offerObjectId = (0, bson_oid_1.toOid)(offerId);
            const concernedOffer = await mongoDbCrud.findOne('offers', { _id: offerObjectId, "data.status": offerStatus_1.offerStatusEnum.active });
            if (!concernedOffer._id) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Offer not found` });
            }
            return res.status(200).json({ ok: true, status: 200, data: Object.assign(Object.assign({}, concernedOffer.data), { id: concernedOffer._id }), message: 'Offer exist!' });
        })();
    });
    app.get('/offers/validation/:offerId', (req, res) => {
        (async () => {
            const offerId = req.params.offerId;
            const offerObjectId = (0, bson_oid_1.toOid)(offerId);
            // Will validate pending offer  to make status active
            const updateOfferRes = await mongoDbCrud.updateOne('offers', { _id: offerObjectId, "data.status": offerStatus_1.offerStatusEnum.pending }, { $set: { "data.status": offerStatus_1.offerStatusEnum.active } });
            if (updateOfferRes.acknowledged && updateOfferRes.modifiedCount === 0) {
                return res.status(400).send(`${offerId} :L’annonce a été déjà validée ou supprimée`);
            }
            return res.status(200).send(`L’annonce est validée! `);
        })();
    });
    app.post('/offers/contact', (req, res) => {
        (async () => {
            const offerContact = req.body || {};
            const { email, offerId } = offerContact;
            if (!email) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :email is required " });
            }
            if (!validator_1.default.isEmail(email)) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect email " });
            }
            if (!(0, bson_oid_1.isStrOid)(offerId)) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Invalid offer id` });
            }
            const offerObjectId = (0, bson_oid_1.toOid)(offerId);
            const concernedOffer = await mongoDbCrud.findOne('offers', { _id: offerObjectId });
            if (!concernedOffer._id) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${offerId} :Offer not found` });
            }
            offerContact.offerId = offerObjectId;
            const offerContactData = offerContact;
            const concernedOfferData = concernedOffer.data;
            const offerContactMail = (0, offerContactController_1.create)().buildOfferContactMail(offerContactData, concernedOfferData);
            await MailService.sendMail(offerContactMail);
            return res.status(200).json({ ok: true, status: 200, message: 'Mail sended!' });
        })();
    });
    // Start listening server 
    app.listen(port, () => logger.info(`Server has started on :${port}`));
}
runServer();
