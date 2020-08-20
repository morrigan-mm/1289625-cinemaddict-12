import {EmojiSize} from "../constants.js";
import {createElement} from "../utils.js";
import EmojiView from "./emoji.js";

const EMOJI_CONTAINER_CLASSNAME = `film-details__emoji-label`;

const createSelectEmojiTemplate = (emoji, active) => {
  return (
    `<span>
      <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emoji}"
        value="${emoji}"
        ${active ? `checked` : ``}
      >
      <label class="${EMOJI_CONTAINER_CLASSNAME}" for="emoji-${emoji}"></label>
    </span>`
  );
};

export default class SelectEmoji {
  constructor(emoji, active) {
    this._emoji = emoji;
    this._active = active;
    this._element = null;
  }

  getTemplate() {
    return createSelectEmojiTemplate(this._emoji, this._active);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());

      const wrapper = this._element.querySelector(`.${EMOJI_CONTAINER_CLASSNAME}`);

      wrapper.appendChild(new EmojiView(this._emoji, EmojiSize.SMALL).getElement());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
