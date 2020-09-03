export const EMOJIS = [`smile`, `sleeping`, `angry`, `puke`];

export const FilmCardCount = {
  MOCK_COUNT: 20,
  DEFAULT: 5,
  EXTRA: 2
};

export const EmojiSize = {
  SMALL: 30,
  LARGE: 55
};

export const DateFormat = {
  /**
   * YYYY/M/D HH:MM
   */
  TIMESTAMP: [`zh-Hans-CN`, {minute: `numeric`, hour: `numeric`, hour12: false}],
  /**
   * D MONTH YYYY
   */
  CALENDAR: [`en-GB`, {year: `numeric`, day: `numeric`, month: `long`}]
};

export const FilterTitle = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const FilmCardControl = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`
};

export const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

export const UserAction = {
  TOGGLE_WATCHLIST: `TOGGLE_WATCHLIST`,
  TOGGLE_WATCHED: `TOGGLE_WATCHED`,
  TOGGLE_FAVORITE: `TOGGLE_FAVORITE`,
};
