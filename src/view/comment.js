import {createEmojiTemplate} from "./emoji.js";
import {EmojiSize} from "../constants.js";
import {formatDate} from "../utils.js";

export const createCommentTemplate = (comment) => {
  const {emoji, text, author, date} = comment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${createEmojiTemplate(emoji, EmojiSize.LARGE)}
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatDate(date, `timestamp`)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};
