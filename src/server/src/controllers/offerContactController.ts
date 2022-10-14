import { OfferT } from '../types/Offer'
import { OfferContactT } from '../types/OfferContact';

export function create() {

    const buildMailHtmlBody = (offerContact: OfferContactT, offer: OfferT) => {
        return `<div>
        <div>Bonjour, </div>

        Je me permet de vous écrire à propos de votre annonce 

        <div> ${offer?.description}. </div>
        
        <div> Cordialement, </div>
        <div> ${offerContact.email ? offerContact.email : '' }</div>
        <div> ${offerContact.phone ? offerContact.phone : '' }</div>
        </div>`;
    };

    const buildOfferContactMail = (offerContact: OfferContactT, offer: OfferT) => {

        const offerMail = {
            from: process.env.SENDGRID_ADMIN_EMAIL_ADDRESS,
            to: offer.email,
            subject: 'Annonce',
            html: buildMailHtmlBody(offerContact, offer)
        }

        return offerMail;

    };

    return { buildOfferContactMail }

}