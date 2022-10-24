
import moment from 'moment';

export function UTCDate(y: number, mth: number, d: number) {
    var utcms = Date.UTC(y, mth, d, 0, 0, 0, 0);
    return new Date(utcms);
}

export function onlyDate(d: Date) {
    if (!d) {
        return d;
    }
    return UTCDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function UTCToday() { //quelle sémantique?! actuellement correpond au today local exprimé en utc => s 'il est le 2/2/2013 00:30 à paris. ça retournera 2/2/2013 en utc. alors qu'il n'est encore que 1/2/2013 11:30 en UTC!
    return onlyDate(new Date());
}

export const dateFormat = "DD/MM/YYYY";

export const isValidDate = (date: Date) => moment(date, true).isValid();

export const toDay = () => moment().clone().startOf('day');

export function addDays(d: Date, y: number) {
    if (d === undefined) {
        return;
    }
    var rc = moment.utc(d).add(y, 'days').toDate();
    //	var rc = new Date(d);
    //	rc.setDate(rc.getUTCDate() + y);
    return rc;
}