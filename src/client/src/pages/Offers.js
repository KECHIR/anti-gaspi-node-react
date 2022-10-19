import React, { useState, useEffect } from 'react';
import OffersList from '../components/OfferList';
import { create as createOfferService } from '../services/offerService.js';

function Offers() {
    let [offersList, setOffersList] = useState([]);

    const offerService = createOfferService();

    useEffect(() => {
        (async () => {
            const fetchedOffersList = await offerService.fetchOffersList();
            setOffersList(fetchedOffersList)
        })();

    }, [offerService]);

    return (
        <div>
            { offersList && offersList.length ? <OffersList offersListData={offersList} /> : null  }
        </div>
    );
}

export default Offers;