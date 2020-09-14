export const Key = {
  ESCAPE: [`Escape`, `Esc`],
  ENTER: `Enter`
};

export const isEscKey = (evt) => {
  return Key.ESCAPE.includes(evt.key);
};
