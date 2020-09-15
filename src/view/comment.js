import AbstractView from "./abstract.js";
import EmojiView from "./emoji.js";
import {EmojiSize, DateFormat} from "../constants.js";
import {formatDate} from "../utils/common.js";

const EMOJI_CONTAINER_CLASSNAME = `film-details__comment-emoji`;

const createCommentTemplate = (commentItem) => {
  const {comment, author, date} = commentItem;

  return (
    `<li class="film-details__comment">
      <span class="${EMOJI_CONTAINER_CLASSNAME}"></span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatDate(date, DateFormat.TIMESTAMP)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractView {
  constructor(comment) {
    super();

    this._comment = comment;
    this._emoji = comment.emotion;

    this._handleCommentDelete = this._handleCommentDelete.bind(this);
  }

  afterElementCreate() {
    const emojiWrapper = this._element.querySelector(`.${EMOJI_CONTAINER_CLASSNAME}`);

    emojiWrapper.appendChild(new EmojiView(this._emoji, EmojiSize.LARGE).getElement());
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  _handleCommentDelete(evt) {
    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.textContent = `Deleting...`;
    this._callback.deleteComment(this._comment.id);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteComment = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._handleCommentDelete);
  }
}
