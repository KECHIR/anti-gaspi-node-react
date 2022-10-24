import * as Yup from 'yup';
import { UTCToday, isValidDate, addDays } from '../helpers/date';
import { OfferT } from '../types/Offer';

const dateNow: Date = UTCToday();

const invalidDateMsg = "La date n'est pas valide";

const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Le nom de la société est obligatoire"),
    email: Yup.string().required("L'adresse e-mail est obligatoire ").email('adresse e-mail invalide'),
    adress: Yup.string().required("L'adresse de la société est obligatoire"),
    description: Yup.string().required("La déscription du matériel est obligatoire"),
    availabilityDate: Yup.date().min(addDays(dateNow, -1), 'Veuillez choisir une date future').typeError(invalidDateMsg),
    expirationDate: Yup
        .date().required('La date expiration est obligatoire')
        .when(
            "availabilityDate",
            (availabilityDate, schema) => {
                if (availabilityDate && isValidDate(availabilityDate)) {
                    return schema.min(availabilityDate, "La date d’expiration doit être supérieure à la date de disponibilité")
                }
            }
        ).typeError(invalidDateMsg)
});

const validateOfferData = async (offerData: OfferT) => {
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

export { validateOfferData }