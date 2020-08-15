import {createCommentTemplate} from "./comment.js";
import {createSelectEmojiTemplate} from "./select-emoji.js";

export const createCommentListTemplate = (comments) => {
  const commentsAmount = comments.length;
  const commentList = comments.map(createCommentTemplate);

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

      <ul class="film-details__comments-list">
        ${commentList.join(``)}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          ${createSelectEmojiTemplate(`smile`, false)}
          ${createSelectEmojiTemplate(`sleeping`, false)}
          ${createSelectEmojiTemplate(`puke`, false)}
          ${createSelectEmojiTemplate(`angry`, false)}
        </div>
      </div>
    </section>`
  );
};
