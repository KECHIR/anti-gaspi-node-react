import React, { useState, useEffect } from 'react';
import OffersList from '../components/OfferList';

function Offers() {

    let [offersList, setOffersList] = useState([]);

    const fetchOffersList = async () => {
        const res = await fetch('/offers');
        const { data } = await res.json() || {};
        return data;
    };

    useEffect(() => {
        (async () => {
            const fetchedOffersList = await fetchOffersList();
            setOffersList(fetchedOffersList)
        })();

    }, []);

    return (
        <div>
            { offersList && offersList.length ? <OffersList offersListData={offersList} /> : null  }
        </div>
    );
}

export default Offers;