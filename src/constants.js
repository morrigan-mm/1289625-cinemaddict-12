export const EMOJI_LIST = [`smile`, `sleeping`, `angry`, `puke`];

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
