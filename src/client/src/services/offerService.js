export function create() {

    const fetchOffersList = async () => {
        const res = await fetch('/offers');
        const { data } = await res.json() || {};
        return data;
    };

    async function createOffer(offerValues) {
        const addOfferRes = await fetch('/offers/add-offer', {
            method: 'POST',
            body: JSON.stringify(offerValues),
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
        const response = await addOfferRes.json();
        return response;
    }

    async function puttingInTouch(offerContactValues) {
        const addOfferRes = await fetch('/offers/contact', {
            method: 'POST',
            body: JSON.stringify(offerContactValues),
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
        const response = await addOfferRes.json();
        return response;
    }

    const fetchOffer = async (offerId) => {
        const res = await fetch(`/offers/${offerId}`);
        return await res.json() || {};
    };

    return { createOffer, puttingInTouch, fetchOffer, fetchOffersList }

}