import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { dateFormat } from '../lib/date-helpers';
import FormikTextInput from '../components/FormikTextInput.js';
import AlertNotification from '../components/AlertNotification.js';
import FormikDateInput from '../components/FormikDateInput.js';
import { create as createOfferService } from '../services/offerService.js';
import { validationSchema, initialValues } from '../models/offerModel.js';

function OfferCreator() {

    const offerService = createOfferService();
    //########## Handle toast
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