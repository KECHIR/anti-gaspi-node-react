import { ObjectId } from 'mongodb';
type ObjectIdT = typeof ObjectId;

export type OfferContactT = {
    firstName?: string
    lasName?: string,
    email: string,
    phone: string,
    message?: string,
    offerId: ObjectIdT,
    creationDate: Date
}