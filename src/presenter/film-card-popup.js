import FilmCardPopupView from "../view/film-card-popup.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {isEscKey} from "../utils/keyboard.js";
import {UserAction} from "../constants.js";
import CommentListPresenter from "./comment-list.js";

export default class FilmCardPopup {
  constructor(film, commentsModel, userActionHandler) {
    this._film = film;
    this._commentsModel = commentsModel;
    this._userActionHandler = userActionHandler;

    const comments = this._commentsModel.getComments();

    this._filmCardPopupComponent = new FilmCardPopupView({comments, film});

    this._popupCloseHandler = this._popupCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._watchListChangeHandler = this._watchListChangeHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
  }

  render() {
    document.body.classList.add(`hide-overflow`);

    document.addEventListener(`keydown`, this._escKeyDownHandler);

    render(document.body, this._filmCardPopupComponent, RenderPosition.BEFOREEND);

    this.renderCommentList();

    this._filmCardPopupComponent.setWatchListChangeHandler(this._watchListChangeHandler);
    this._filmCardPopupComponent.setWatchedChangeHandler(this._watchedChangeHandler);
    this._filmCardPopupComponent.setFavoriteChangeHandler(this._favoriteChangeHandler);
    this._filmCardPopupComponent.setPopupCloseHandler(this._popupCloseHandler);
  }

  renderCommentList() {
    const comments = this._commentsModel.getComments();
    const container = this._filmCardPopupComponent.getCommentsContainer();
    this._commentListPresenter = new CommentListPresenter(container, this._film.id, comments, this._userActionHandler);
    this._commentListPresenter.render();
  }

  close() {
    remove(this._filmCardPopupComponent);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    document.body.classList.remove(`hide-overflow`);
  }

  isOpen() {
    return document.body.classList.contains(`hide-overflow`);
  }

  updateData(update) {
    this._filmCardPopupComponent.updateData(update);

    this.renderCommentList();
  }

  shakeForm() {
    if (this._commentListPresenter) {
      this._commentListPresenter.shakeForm();
    }
  }

  _popupCloseHandler() {
    this.close();
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.close();
    }
  }

  _watchListChangeHandler() {
    this._userActionHandler(UserAction.TOGGLE_WATCHLIST, this._film);
  }

  _watchedChangeHandler() {
    this._userActionHandler(UserAction.TOGGLE_WATCHED, this._film);
  }

  _favoriteChangeHandler() {
    this._userActionHandler(UserAction.TOGGLE_FAVORITE, this._film);
  }
}
