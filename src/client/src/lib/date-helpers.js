
export function UTCDate(y, mth, d, h, m, s, ms) {
    var utcms = Date.UTC(y, mth, d, h || 0, m || 0, s || 0, ms || 0);
    return new Date(utcms);
}

export function onlyDate(d) {
    if (!d) {
        return d;
    }
    return UTCDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function UTCToday() { //quelle sémantique?! actuellement correpond au today local exprimé en utc => s 'il est le 2/2/2013 00:30 à paris. ça retournera 2/2/2013 en utc. alors qu'il n'est encore que 1/2/2013 11:30 en UTC!
    return onlyDate(new Date());
}

export const dateFormat = "DD/MM/YYYY";