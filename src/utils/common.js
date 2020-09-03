export const formatDate = (date, format = []) => {
  const params = format;

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

