import AbstractView from "./abstract.js";
import {EmojiSize} from "../constants.js";
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

export default class SelectEmoji extends AbstractView {
  constructor(emoji, active) {
    super();

    this._emoji = emoji;
    this._active = active;

    this._clickHandler = this._clickHandler.bind(this);
  }

  afterElementCreate() {
    const wrapper = this._element.querySelector(`.${EMOJI_CONTAINER_CLASSNAME}`);

    wrapper.appendChild(new EmojiView(this._emoji, EmojiSize.SMALL).getElement());
  }

  getTemplate() {
    return createSelectEmojiTemplate(this._emoji, this._active);
  }

  setSelectHandler(callback) {
    this._callback.select = callback;

    this.getElement().querySelector(`input`).addEventListener(`click`, this._clickHandler);
  }

  _clickHandler() {
    this._callback.select();
  }
}
