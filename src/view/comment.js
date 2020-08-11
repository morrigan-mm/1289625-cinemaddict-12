import {createEmojiTemplate} from "./emoji.js";
import {EmojiSize} from "../constants.js";

export const createCommentTemplate = (comment) => {
  const {emoji, text, author, date} = comment;

  const dateFormatted = date.toLocaleDateString(`zh-Hans-CN`, {minute: `numeric`, hour: `numeric`, hour12: false});

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${createEmojiTemplate(emoji, EmojiSize.LARGE)}
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dateFormatted}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};
