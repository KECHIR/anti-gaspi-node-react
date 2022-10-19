import React, { useState } from 'react';
import { Formik, Form/*, ErrorMessage, Field*/ } from 'formik';
import * as Yup from 'yup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { isValidDate, addDays } from '../lib/moment.js';
import { UTCToday, dateFormat } from '../lib/date-helpers';
import "moment/locale/fr"
import FormikTextInput from '../components/FormikTextInput.js';
import AlertNotification from '../components/AlertNotification.js';
import { create as createOfferService } from '../services/offerService.js';

function OfferCreator() {

    const dateNow = UTCToday();

    const offerService = createOfferService();

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

    validationSchema.cast({ availabilityDate: dateNow, expirationDate: dateNow });

    const initAlertNotificationInfos = { ok: false };
    const [alertNotificationInfos, setAlertNotificationInfos] = useState(initAlertNotificationInfos);

    const handleCloseAlerNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertNotificationInfos(initAlertNotificationInfos);
    };

    const createOffer = async (values) => {
        // Create offer
        const response = await offerService.createOffer(values);
        if (response.ok) {
            setAlertNotificationInfos({ ok: true, message: "L'offre est crée avec succès ", severity: "success" });
        } else {
            setAlertNotificationInfos({ ok: true, message: "Erreur lors de la création d'offre ", severity: "error" });
        }
    };

    // "DD/MM/YYYY"  //  label={formikFieldLabel}              <ErrorMessage name={formikFieldName} className='form-label-field text-feedback' component="span" />
    const FormikDateInput = ({ formik, formikFieldName, formikFieldLabel, dateFormat, spacing }) => {
        return <div className='from-field-wrap'>
            <div>
                <label>
                    <span className='form-label-field'> {formikFieldLabel} </span>
                </label>
            </div>
            <div>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fr"  >
                    <Stack spacing={spacing}>
                        <DesktopDatePicker
                            disablePast={true}
                            name={formikFieldName}
                            inputFormat={dateFormat}
                            value={formik.values[formikFieldName]}
                            onChange={(val) => formik.setFieldValue(`${formikFieldName}`, val)}
                            renderInput={(params) => <TextField  {...params} />}
                        />
                    </Stack>
                </LocalizationProvider>
            </div>
            {formik.errors[formikFieldName] ? <span className='form-label-field text-feedback'> {formik.errors[formikFieldName]} </span> : null}
        </div>
    }

    return (
        <div>

            {alertNotificationInfos.ok ? <AlertNotification severity={alertNotificationInfos.severity} open={true} message={alertNotificationInfos.message} handleClose={handleCloseAlerNotification} /> : null}
            <Formik initialValues={initialValues} onSubmit={createOffer} validationSchema={validationSchema} >
                {
                    (formik) => (
                        <Form className='form-offer'>
                            <h1> Créer une annonce </h1>
                            <div className='align-horizontally '>
                                <FormikTextInput fieldClassName='tds-form-input' labelName="Nom de la société*" type="text" id="companyName" name="companyName" component="input" />
                                <FormikTextInput fieldClassName='tds-form-input' labelName="Email*" type="text" id="email" name="email" component="input" />
                            </div>
                            <FormikTextInput fieldClassName='tds-form-input' labelName="Adresse*" type="text" id="adress" name="adress" component="input" />
                            <div className='align-horizontally '>
                                <FormikTextInput fieldClassName="tds-form-textarea-input" labelName="Matériel/description*" type="text" id="description" name="description" component="textarea" rows={10} />
                                <div className='align-vertically'>
                                    <FormikDateInput formik={formik} formikFieldName="availabilityDate" formikFieldLabel="Dispo à partir de*" dateFormat={dateFormat} spacing={3} />
                                    <FormikDateInput formik={formik} formikFieldName="expirationDate" formikFieldLabel="Expiration le*" dateFormat={dateFormat} spacing={3} />
                                </div>
                            </div>
                            <div className='from-field-wrap'>
                                <button disabled={!formik.isValid} className={!formik.isValid ? 'btn-disabled' : 'btn'}  >Créer l'annonce</button>
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </div>
    );
}

export default OfferCreator;