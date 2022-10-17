import React from 'react';
import { Formik, Form/*, ErrorMessage, Field*/ } from 'formik';
import * as Yup from 'yup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { isValidDate } from '../lib/moment.js';
import { UTCToday, dateFormat } from '../lib/date-helpers';
import "moment/locale/fr"
import FormikTextInput from '../components/FormikTextInput.js';

function OfferCreator() {

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
        availabilityDate: Yup.date().min(dateNow, 'Veuillez choisir une date future').typeError(invalidDateMsg),
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
    const createOffer = async (values) => {
        // Create offer
        const addOfferRes = await fetch('/offers/add-offer', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
        const response = await addOfferRes.json();
        console.log(' Add offer response=' + JSON.stringify(response));
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
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fr" >
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