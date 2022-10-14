import { OfferT } from '../types/Offer'
import { LinksT } from '../types/Links';

export function create() {

    const buildMailHtmlBody = (offer: OfferT, linkInfos: LinksT) => {
        return `<div> 
        L'annonce suivante vient d'être créée :
        <div> <label> Annonce : </label> ${offer?.description} </div>
        <div> <label> Le nom de la société : </label> ${offer?.companyName} </div>
        <div> <label> L'adresse de la société : </label> ${offer?.adress} </div>
        <div> Lien de validation de l'annonce : <a href=${linkInfos?.validationUrl}> cliquer ici pour valider l'annonce <a/>
        </div>`;
    };

    const buildOfferMail = (offer: OfferT, linkInfos: LinksT) => {

        const offerMail = {
            from: process.env.SENDGRID_ADMIN_EMAIL_ADDRESS,
            to: 'riad.kechir@soat.fr',
            subject: 'Annonce',
            html: buildMailHtmlBody(offer, linkInfos)
        }

        return offerMail;

    };

    return { buildOfferMail }

}