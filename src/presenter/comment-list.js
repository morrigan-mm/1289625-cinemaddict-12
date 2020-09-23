import {UserAction} from "../constants.js";
import CommentListView from "../view/comment-list.js";
import {render, RenderPosition} from "../utils/render.js";

export default class CommentList {
  constructor(container, filmId, comments, userActionHandler) {
    this._container = container;
    this._filmId = filmId;
    this._comments = comments;
    this._userActionHandler = userActionHandler;

    const view = new CommentListView(this._comments);

    this._commentListView = view;

    this.shakeForm = view.shakeForm.bind(view);
  }

  render() {
    render(this._container, this._commentListView, RenderPosition.BEFOREEND);

    this._commentListView.setAddCommentHandler((localComment) => {
      this._userActionHandler(UserAction.ADD_COMMENT, {localComment, filmId: this._filmId});
    });

    this._commentListView.setDeleteCommentHandler((commentId) => {
      this._userActionHandler(UserAction.DELETE_COMMENT, commentId);
    });
  }
}
