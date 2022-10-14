import { useNavigate } from "react-router-dom";

export default function OfferItem({ offerItemData }) {
    const { _id: offerId, data } = offerItemData || {};

    const navigate = useNavigate();
    const navigateToContactOffer = () => navigate(`/offer/${offerId}`)
    
    const { adress, description } = data || {};
    return <div className="offer-item">
        <div className="offer-item-padding">{adress}</div>
        <div className="offer-item-padding">{description}</div>
        <div className="offer-item-bottom offer-item-padding">
            <button className='btn' onClick={navigateToContactOffer} >Contacter</button>
            <div> Expire le 30/10/2022 </div>
        </div>
    </div>
}