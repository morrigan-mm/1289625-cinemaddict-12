const dateFormatMap = {
  /**
   * YYYY/M/D HH:MM
   */
  timestamp: [`zh-Hans-CN`, {minute: `numeric`, hour: `numeric`, hour12: false}],
  /**
   * D MONTH YYYY
   */
  calendar: [`en-GB`, {year: `numeric`, day: `numeric`, month: `long`}]
};

export const formatDate = (date, format) => {
  const params = dateFormatMap[format] || [];
  return date.toLocaleDateString(...params);
};

export const capitalize = (str) => {
  return str.replace(str[0], str[0].toUpperCase());
};

export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
};

export const sortBy = (array, fn) => {
  return array.slice().sort((a, b) => fn(b) - fn(a));
};

