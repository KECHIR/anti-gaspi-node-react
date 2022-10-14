import OfferItem from "./OfferItem"

export default function OffersList({ offersListData }) {
    return <div className="offers-list">
        <h1> Annonces </h1>
        {offersListData.map((offerItemData,idx) => <OfferItem key={idx} offerItemData={offerItemData} />)}
    </div>
}