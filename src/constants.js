export const IS_MAC = navigator.platform.toUpperCase().indexOf(`MAC`) >= 0;

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
   * YYYY/MM/DD HH:MM
   */
  TIMESTAMP: `TIMESTAMP`,
  /**
   * D MONTH YYYY
   */
  CALENDAR: `CALENDAR`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const PageType = {
  FILM_LIST: `film-list`,
  STATISTICS: `statistics`
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

export const StatisticsPeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

export const UserAction = {
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
  CLICK_CARD: `CLICK_CARD`,
  TOGGLE_WATCHLIST: `TOGGLE_WATCHLIST`,
  TOGGLE_WATCHED: `TOGGLE_WATCHED`,
  TOGGLE_FAVORITE: `TOGGLE_FAVORITE`,
};
