import {EmojiSize} from "../constants.js";
import {createEmojiTemplate} from "./emoji.js";

export const createSelectEmojiTemplate = (emoji, active) => {
  return (
    `<input class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${active ? `checked` : ``}
    >
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      ${createEmojiTemplate(emoji, EmojiSize.SMALL)}
    </label>`
  );
};
