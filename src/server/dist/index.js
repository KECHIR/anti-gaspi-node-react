"use strict";
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
const port = process.env.PORT || 5000;
async function runServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({ /*origin: 'http://localhost:3000'*/}));
    const dbCtxt = await (0, mongo_1.create)().getDbCtxt();
    const mongoDbCrud = (0, crud_1.create)(dbCtxt);
    app.post('/offers/add-offer', async (req, res) => {
        const offer = req.body || {};
        const { companyName, email, adress, description, availabilityDate, expirationDate } = offer;
        if (!companyName) {
            console.log(' passe here 1');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :companyName is required " });
        }
        if (!validator_1.default.isAlphanumeric(companyName)) {
            console.log(' passe here 2');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect companyName " });
        }
        if (!email) {
            console.log(' passe here 3');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :email is required " });
        }
        if (!validator_1.default.isEmail(email)) {
            console.log(' passe here 4');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect email " });
        }
        if (!adress) {
            console.log(' passe here 5');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :adress is required " });
        }
        if (!description) {
            console.log(' passe here 7');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :description is required " });
        }
        if (!validator_1.default.isAlphanumeric(description)) {
            console.log(' passe here 8');
            return res.status(304).json({ ok: false, level: 'error', status: 304, message: "Unprocessable Entity :incorrect description " });
        }
        offer.availabilityDate = new Date(availabilityDate);
        offer.expirationDate = new Date(expirationDate);
        offer.status = offerStatus_1.offerStatusEnum.pending;
        const addOfferRes = mongoDbCrud.insert('offers', { data: offer });
        return res.status(200).json(Object.assign(Object.assign({}, addOfferRes), { status: 200, message: "Offer successfully added!" }));
    });
    // Start listening server 
    app.listen(port, () => console.log(`Server has started on :${port}`));
}
runServer();
