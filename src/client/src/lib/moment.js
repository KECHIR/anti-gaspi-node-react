import moment from 'moment';

import { dateFormat } from './date-helpers.js';

export const isValidDate = (date, dateFormat) => moment(date, dateFormat, true).isValid();

export const toDay = () => moment().clone().startOf('day');

export const showDate = (d) => moment.utc(d).format(dateFormat)