import express, { Express, Request, Response } from 'express';
import { create as createOffersController } from '../controllers/offersController';
import { LinksT } from '../types/Links';
import { offerStatusEnum } from '../types/offerStatus';
import { OfferT } from '../types/Offer';
import { validateOfferData } from '../validation/validation-offer-data';
import { toOid, isStrOid } from '../helpers/bson-oid';
import { OfferContactT } from '../types/OfferContact';
import { create as createOfferContactController } from '../controllers/offerContactController';
import { validateOfferContactData } from '../validation/validation-offerContact-data';


export function offersRouteur(mongoDbCrud: any, MailService: any) {

    const router = express.Router();
    const origin = "http://";

    router.post('/add-offer', async (req: Request, res: Response) => {
        const offer = req.body || {};
        const { availabilityDate, expirationDate } = offer;
        offer.availabilityDate = new Date(availabilityDate);
        offer.expirationDate = new Date(expirationDate);
        offer.status = offerStatusEnum.pending;
        const offerData: OfferT = offer;
        // Validate offer data
        const validationOfferDataRes = await validateOfferData(offerData);
        if (!validationOfferDataRes.ok) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, errors: validationOfferDataRes.errors });
        }
        // Will create offer in mongo db
        const addOfferRes = await mongoDbCrud.insertOne('offers', { data: offerData });
        // Will sending mail
        if (addOfferRes.acknowledged) {
            const linksInfos = <LinksT>{ validationUrl: `${origin}${req.headers.host}/offers/validation/${addOfferRes.insertedId.toString()}` }
            const offerMail = createOffersController().buildOfferMail(offerData, linksInfos);
            await MailService.sendMail(offerMail);
        }
        //Will return response
        return res.status(200).json({ ...addOfferRes, ok: true, status: 200, message: "Offer successfully added!" });
    });

    router.get('/', async (req: Request, res: Response) => {
        const addOfferRes = await mongoDbCrud.find('offers', { "data.status": offerStatusEnum.active });
        return res.status(200).json({ ok: true, status: 200, data: addOfferRes })
    });

    router.get('/:offerId', (req: Request, res: Response) => {
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

    router.get('/validation/:offerId', (req: Request, res: Response) => {
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

    router.post('/contact', (req: Request, res: Response) => {
        (async () => {
            const offerContact = req.body || {};
            const { email, offerId } = offerContact;
            if (!isStrOid(offerId)) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, errors: [{ message: `${offerId} :Invalid offer id` }] });
            }
            // Validate offer contact data
            const validationOfferContactDataRes = await validateOfferContactData(offerContact);
            if (!validationOfferContactDataRes.ok) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, errors: validationOfferContactDataRes.errors });
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

    return { router };
}


