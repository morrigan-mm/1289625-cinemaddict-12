import he from 'he';
import AbstractView from "./abstract.js";
import CommentView from "./comment.js";
import EmojiView from "./emoji.js";
import SelectEmojiView from "./select-emoji.js";
import {EMOJIS, EmojiSize, IS_MAC} from "../constants.js";
import {remove} from "../utils/render.js";
import {Key} from "../utils/keyboard.js";
import {isOnline} from "../utils/common.js";

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
        <input type="hidden" name="emotion">
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

    this._handleCommentAdd = this._handleCommentAdd.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
  }

  afterElementCreate() {
    this.renderComments();
    this.renderEmojis();
  }

  getTemplate() {
    return createCommentListTemplate(this._comments);
  }

  getForm() {
    return this.getElement().querySelector(`[name="comment"]`).form;
  }

  renderComments() {
    const commentListWrapper = this._element.querySelector(`.${COMMENTS_CONTAINER_CLASSNAME}`);

    this._comments.forEach((comment) => {
      const commentView = new CommentView(comment);

      commentView.setDeleteCommentHandler(this._handleCommentDelete);

      commentListWrapper.appendChild(commentView.getElement());
    });
  }

  renderEmojis() {
    const selectListWrapper = this._element.querySelector(`.${SELECT_EMOJI_CONTAINER_CLASSNAME}`);
    const selectEmojiLabel = this._element.querySelector(`.${SELECT_EMOJI_LABEL}`);

    EMOJIS.forEach((emoji) => {
      const view = new SelectEmojiView(emoji, false);

      view.setSelectHandler(() => {
        this.setActiveEmoji(selectEmojiLabel, emoji);
      });

      selectListWrapper.appendChild(view.getElement());
    });
  }

  shakeForm() {
    const label = this.getElement().querySelector(`.film-details__comment-label`);
    this.shakeElement(label);
  }

  setActiveEmoji(container, emoji) {
    if (this.activeEmojiView) {
      remove(this.activeEmojiView);
    }

    if (isOnline()) {
      this.getForm().elements.emotion.value = emoji;

      this.activeEmojiView = new EmojiView(emoji, EmojiSize.LARGE);

      container.appendChild(this.activeEmojiView.getElement());
    }
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getForm().addEventListener(`keydown`, this._handleCommentAdd);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteComment = callback;
  }

  _handleCommentAdd(evt) {
    if (!isOnline()) {
      evt.preventDefault();
      return;
    }

    const form = this.getForm();

    const isModifier = IS_MAC ? evt.metaKey : evt.ctrlKey;
    if (this._callback.addComment && form.elements.emotion.value && isModifier && evt.key === Key.ENTER) {

      this._callback.addComment({
        comment: he.encode(form.elements.comment.value),
        date: new Date().toISOString(),
        emotion: form.elements.emotion.value,
      });
    }
  }

  _handleCommentDelete(commentId) {
    if (this._callback.deleteComment) {
      this._callback.deleteComment(commentId);
    }
  }
}
