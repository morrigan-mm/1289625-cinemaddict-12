import AbstractView from "./abstract.js";

const createEmojiTemplate = (emoji, size) => {
  return (
    `<img src="./images/emoji/${emoji}.png" width="${size}" height="${size}" alt="emoji-${emoji}">`
  );
};

export default class Emoji extends AbstractView {
  constructor(emoji, size) {
    super();

    this._emoji = emoji;
    this._size = size;
  }

  getTemplate() {
    return createEmojiTemplate(this._emoji, this._size);
  }
}
