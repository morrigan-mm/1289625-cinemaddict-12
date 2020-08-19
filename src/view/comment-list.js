import CommentView from "./comment.js";
import SelectEmojiView from "./select-emoji.js";
import {EMOJI_LIST} from "../constants.js";
import {createElement} from "../utils.js";

const COMMENTS_CONTAINER_CLASSNAME = `film-details__comments-list`;
const SELECT_EMOJI_CONTAINER_CLASSNAME = `film-details__emoji-list`;

const createCommentListTemplate = (comments) => {
  const commentsAmount = comments.length;

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

      <ul class="${COMMENTS_CONTAINER_CLASSNAME}"></ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="${SELECT_EMOJI_CONTAINER_CLASSNAME}"></div>
      </div>
    </section>`
  );
};

export default class CommentList {
  constructor(comments) {
    this._comments = comments;
    this._element = null;
  }

  getTemplate() {
    return createCommentListTemplate(this._comments);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      const commentListWrapper = this._element.querySelector(`.${COMMENTS_CONTAINER_CLASSNAME}`);
      this._comments.forEach((comment) => commentListWrapper.appendChild(new CommentView(comment).getElement()));
      const selectListWrapper = this._element.querySelector(`.${SELECT_EMOJI_CONTAINER_CLASSNAME}`);
      EMOJI_LIST.forEach((emoji) => selectListWrapper.appendChild(new SelectEmojiView(emoji, false).getElement()));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
