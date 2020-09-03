import AbstractView from "./abstract.js";
import CommentView from "./comment.js";
import EmojiView from "./emoji.js";
import SelectEmojiView from "./select-emoji.js";
import {EMOJIS, EmojiSize} from "../constants.js";
import {remove} from "../utils/render.js";

const COMMENTS_CONTAINER_CLASSNAME = `film-details__comments-list`;
const SELECT_EMOJI_LABEL = `film-details__add-emoji-label`;
const SELECT_EMOJI_CONTAINER_CLASSNAME = `film-details__emoji-list`;

const createCommentListTemplate = (comments) => {
  const commentsAmount = comments.length;

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

      <ul class="${COMMENTS_CONTAINER_CLASSNAME}"></ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="${SELECT_EMOJI_LABEL}"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="${SELECT_EMOJI_CONTAINER_CLASSNAME}"></div>
      </div>
    </section>`
  );
};

export default class CommentList extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;
    this._element = null;
  }

  afterElementCreate() {
    this.renderComments();
    this.renderEmojis();
  }

  getTemplate() {
    return createCommentListTemplate(this._comments);
  }

  removeElement() {
    this._element = null;
  }

  renderComments() {
    const commentListWrapper = this._element.querySelector(`.${COMMENTS_CONTAINER_CLASSNAME}`);

    this._comments.forEach((comment) => commentListWrapper.appendChild(new CommentView(comment).getElement()));
  }

  renderEmojis() {
    const selectListWrapper = this._element.querySelector(`.${SELECT_EMOJI_CONTAINER_CLASSNAME}`);
    const selectEmojiLabel = this._element.querySelector(`.${SELECT_EMOJI_LABEL}`);

    let emojiView;

    EMOJIS.forEach((emoji) => {
      const view = new SelectEmojiView(emoji, false);

      view.setSelectHandler(() => {
        if (emojiView) {
          remove(emojiView);
        }

        emojiView = new EmojiView(emoji, EmojiSize.LARGE);

        selectEmojiLabel.appendChild(emojiView.getElement());
      });

      selectListWrapper.appendChild(view.getElement());
    });
  }
}
