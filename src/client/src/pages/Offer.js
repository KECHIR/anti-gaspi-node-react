import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import FormikTextInput from '../components/FormikTextInput';
import AlertNotification from '../components/AlertNotification.js';
import { create as createOfferService } from '../services/offerService.js';
import { validationSchema, initialValues } from '../models/offerContactModel.js';

function Offer() {

    const { offerId } = useParams();
    const offerService = createOfferService();
    // fetch offerId in data base if not existe return null 
    let [isOfferExist, setIsOfferExist] = useState(false);

    const initAlertNotificationInfos = { ok: false };
    const [alertNotificationInfos, setAlertNotificationInfos] = useState(initAlertNotificationInfos);

    const handleCloseAlerNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertNotificationInfos(initAlertNotificationInfos);
    };

    useEffect(() => {
        (async () => {
            const offerInfo = await offerService.fetchOffer(offerId);
            if (offerInfo.ok) {
                setIsOfferExist(offerInfo.ok)
            }
        })();

    }, [offerId, offerService]); // mais peut étre ça sera suprimée à la main en base ! danger

    const onContactOfferFormSubmit = async (values) => {
        const puttingInTouchRes = await offerService.puttingInTouch({ ...values, offerId });
        if (puttingInTouchRes.ok) {
            setAlertNotificationInfos({ ok: true, message: "Le mail est envoyé avec succès ", severity: "success" });
        } else {
            setAlertNotificationInfos({ ok: true, message: "Erreur lors de la mise en contact ", severity: "error" });
        }
    };

    return <div>
        {alertNotificationInfos.ok ? <AlertNotification severity={alertNotificationInfos.severity} open={true} message={alertNotificationInfos.message} handleClose={handleCloseAlerNotification} /> : null}
        {!isOfferExist ? null :
            <Formik initialValues={initialValues} onSubmit={onContactOfferFormSubmit} validationSchema={validationSchema} >
                {
                    (formik) => (
                        <Form className='form-offer'>
                            <h1> Contacter </h1>
                            <div className='align-horizontally '>
                                <FormikTextInput fieldClassName='tds-form-input' labelName="Email*" type="text" id="email" name="email" component="input" />
                                <FormikTextInput fieldClassName='tds-form-input' labelName="Numéro de téléphone*" type="text" id="phone" name="phone" component="input" maxLength={10} />

                            </div>
                            <FormikTextInput fieldClassName="tds-form-textarea-input" labelName="Message" type="text" id="message" name="message" component="textarea" rows={10} />
                            <div className='from-field-wrap'>
                                <button disabled={!formik.isValid} className={!formik.isValid ? 'btn-disabled' : 'btn'}  >Mise en contact</button>
                            </div>
                        </Form>
                    )
                }
            </Formik>
        }
    </div>;
}

export default Offer;