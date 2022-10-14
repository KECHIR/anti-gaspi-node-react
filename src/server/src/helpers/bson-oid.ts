import { ObjectId } from 'mongodb';

export const toOid = (strId: string) => new ObjectId(strId);

export const isStrOid = (strid: string) => strid.length === 24;