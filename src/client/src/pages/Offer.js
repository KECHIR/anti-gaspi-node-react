import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Formik, Form/*, ErrorMessage, Field*/ } from 'formik';
import * as Yup from 'yup';
import FormikTextInput from '../components/FormikTextInput';

function Offer() {

    const { offerId } = useParams();
    // fetch offerId in data base if not existe return null 

    let [isOfferExist, setIsOfferExist] = useState(false);

    const fetchOffer = async (offerId) => {
        const res = await fetch(`/offers/${offerId}`);
        return await res.json() || {};
    };

    useEffect(() => {
        (async () => {
            const offerInfo = await fetchOffer(offerId);
            if (offerInfo.ok) {
                setIsOfferExist(offerInfo.ok)
            }
        })();

    }, [offerId]); // mais peut étre ça sera suprimée à la main en base ! danger

    const initialValues = {
        email: "", phone: "", message: ""
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("L'adresse e-mail est obligatoire").email('Veuillez entrer une adresse e-mail valide'),
        phone: Yup.string().matches(phoneRegExp, "Veuillez entrer un numéro de téléphone valide").min(10, 'Le numéro de téléphone doit contenir 10 chiffres')
            .max(10, 'Le numéro de téléphone doit contenir 10 chiffres').required("Le numéro de téléphone est obligatoire"),
        message: Yup.string()
    });

    // Mise en contact 
    const puttingInTouch = async (offerContactValues) => {
        const addOfferRes = await fetch('/offers/contact', {
            method: 'POST',
            body: JSON.stringify(offerContactValues),
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
        const response = await addOfferRes.json();
    };

    const onContactOfferFormSubmit = async (values) => {
        const puttingInTouchRes = await puttingInTouch({ ...values, offerId });
    };

    return <div>
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
                            <button disabled={!formik.isValid} className={!formik.isValid ? 'btn-disabled':'btn'}  >Mise en contact</button>
                            </div>
                        </Form>
                    )
                }
            </Formik>
        }
    </div>;
}

export default Offer;