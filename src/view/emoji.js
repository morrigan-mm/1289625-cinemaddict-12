import {createElement} from "../utils.js";

const createEmojiTemplate = (emoji, size) => {
  return (
    `<img src="./images/emoji/${emoji}.png" width="${size}" height="${size}" alt="emoji-${emoji}">`
  );
};

export default class Emoji {
  constructor(emoji, size) {
    this._emoji = emoji;
    this._size = size;
    this._element = null;
  }

  getTemplate() {
    return createEmojiTemplate(this._emoji, this._size);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
