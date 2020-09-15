import {UserAction} from "../constants.js";
import CommentListView from "../view/comment-list.js";
import {render, RenderPosition} from "../utils/render.js";

export default class CommentList {
  constructor(container, filmId, comments, onUserAction) {
    this._container = container;
    this._filmId = filmId;
    this._comments = comments;
    this._onUserAction = onUserAction;

    const view = new CommentListView(this._comments);

    this._commentListView = view;

    this.shakeForm = view.shakeForm.bind(view);
  }

  render() {
    render(this._container, this._commentListView, RenderPosition.BEFOREEND);

    this._commentListView.setAddCommentHandler((localComment) => {
      this._onUserAction(UserAction.ADD_COMMENT, {localComment, filmId: this._filmId});
    });

    this._commentListView.setDeleteCommentHandler((commentId) => {
      this._onUserAction(UserAction.DELETE_COMMENT, commentId);
    });
  }
}
