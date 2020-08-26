const Key = {
  ESCAPE: [`Escape`, `Esc`]
};

export const isEscKey = (evt) => {
  return Key.ESCAPE.includes(evt.key);
};
