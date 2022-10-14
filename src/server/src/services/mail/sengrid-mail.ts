import MailService from '@sendgrid/mail';
import * as logger from '../../logger/logger';

export function sendgridService(apiKey: string) {

    MailService.setApiKey(apiKey);

    async function sendMail(mail:any) { // c'est le type mail pas any !!danger
        try {
            const { to, from, subject, html/*, attachements*/ } = mail || {};

            if (!to) {
                throw new Error(`Error when sending mail : missing 'to sender'`);
            }

            if (!from) {
                throw new Error(`Error when sending mail : missing 'from recipient'`);
            }

            let msg = {
                from: from ? from : 'laurent.pichet@soat.fr',
                to,
                subject: subject ? subject : '',
                html: html ? html : ''
            };
            console.log(' Mail  '+JSON.stringify(msg));
            await MailService.send(msg);
        }
        catch (err) {
            const text = `Sendgrid service err: ${JSON.stringify(err)}`;
            logger.error(text);
            throw new Error(text);
        }
    }

    return { sendMail }
}