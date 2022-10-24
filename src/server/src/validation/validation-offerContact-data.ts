import * as Yup from 'yup';

import { OfferContactT } from '../types/OfferContact';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    email: Yup.string().required("L'adresse e-mail est obligatoire").email('Veuillez entrer une adresse e-mail valide'),
    phone: Yup.string().matches(phoneRegExp, "Veuillez entrer un numéro de téléphone valide").min(10, 'Le numéro de téléphone doit contenir 10 chiffres')
        .max(10, 'Le numéro de téléphone doit contenir 10 chiffres').required("Le numéro de téléphone est obligatoire"),
    message: Yup.string()
});

const validateOfferContactData = async (offerData: OfferContactT) => {
    let errors: object[] = [];
    try {
        await validationSchema.validate(offerData, { abortEarly: false });
    } catch (err: any) {
        err.inner.forEach((element: { path: string; message: string; }) => {
            const error = { name: element.path, message: element.message };
            errors.push(error as never)
        });
    }
    return { ok: !errors.length, errors }
};

export { validateOfferContactData };