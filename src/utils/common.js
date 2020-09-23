import moment from "moment";
import {DateFormat} from "../constants.js";

const formatCalendarDate = (date) => {
  return moment(date).format(`D MMMM YYYY`);
};

const formatTimestampDate = (date) => {
  const now = moment();
  const then = moment(date);
  const inMonths = now.diff(then, `months`, true);
  const inHours = now.diff(then, `hours`, true);

  if (inMonths >= 1) {
    return then.format(`YYYY/MM/DD HH:mm`);
  }

  if (inHours > 12 && inHours <= 24) {
    return `Today`;
  }

  if (inHours > 24 && inHours <= 48) {
    return `Yesterday`;
  }

  return then.from(now);
};

export const formatDate = (date, format) => {
  switch (format) {
    case DateFormat.CALENDAR: {
      return formatCalendarDate(date);
    }
    case DateFormat.TIMESTAMP: {
      return formatTimestampDate(date);
    }
    default: {
      return moment().format(`LLLL`);
    }
  }
};

export const formatDuration = (duration) => {
  return moment.utc(moment.duration(duration, `minutes`).asMilliseconds()).format(`H[h] m[m]`);
};

export const sortBy = (elements, sortCallback) => {
  return elements.slice().sort((element1, element2) => sortCallback(element2) - sortCallback(element1));
};

export const copy = (obj) => {
  return Object.assign({}, obj);
};

export const update = (obj, upd) => {
  return Object.assign({}, obj, upd);
};

export const updateListItem = (list, item) => {
  const index = list.findIndex((it) => it.id === item.id);

  if (index === -1) {
    return list;
  }

  return [...list.slice(0, index), item, ...list.slice(index + 1)];
};

export const isOnline = () => {
  return window.navigator.onLine;
};
