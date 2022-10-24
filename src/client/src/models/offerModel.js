import * as Yup from 'yup';
import { isValidDate, addDays } from '../lib/moment.js';
import { UTCToday } from '../lib/date-helpers';

const dateNow = UTCToday();

const invalidDateMsg = "La date n'est pas valide";

const initialValues = {
    companyName: "", email: "", adress: "", description: "", availabilityDate: dateNow, expirationDate: dateNow
};

const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Le nom de la société est obligatoire"),
    email: Yup.string().required("L'adresse e-mail est obligatoire ").email('Veuillez entrer une adresse e-mail valide'),
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

export { validationSchema, initialValues }