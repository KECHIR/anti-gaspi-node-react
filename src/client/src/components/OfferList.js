import OfferItem from "./OfferItem"

export default function OffersList({ offersListData }) {
    return <div className="offers-list">
        <h1> Annonces </h1>
        {offersListData.map((offerItemData) => <OfferItem key={offerItemData._id} offerItemData={offerItemData} />)}
    </div>
}