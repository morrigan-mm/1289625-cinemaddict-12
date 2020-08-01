import {createEmojiTemplate} from "./emoji.js";
import {EmojiSize} from "./constants";

export const createCommentTemplate = (comment) => {
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${createEmojiTemplate(comment.emoji, EmojiSize.LARGE)}
      </span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${comment.day}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};
