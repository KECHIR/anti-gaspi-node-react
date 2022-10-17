import { useNavigate } from "react-router-dom";
import { showDate } from '../lib/moment.js';

export default function OfferItem({ offerItemData }) {
    const { _id: offerId, data } = offerItemData || {};

    const navigate = useNavigate();
    const navigateToContactOffer = () => navigate(`/offer/${offerId}`)

    const { adress, description, expirationDate } = data || {};
    return <div className="offer-item">
        <div className="offer-item-padding">{adress}</div>
        <div className="offer-item-padding">{description}</div>
        <div className="offer-item-bottom offer-item-padding">
            <button className='btn' onClick={navigateToContactOffer} >Contacter</button>
            <div> Expire le {`${showDate(expirationDate)}`} </div>
        </div>
    </div>
}