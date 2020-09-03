import FilmCardPopupView from "../view/film-card-popup.js";

import {render, RenderPosition, remove} from "../utils/render.js";
import {isEscKey} from "../utils/keyboard.js";

export default class FilmCardPopup {
  constructor(film) {
    const view = new FilmCardPopupView(film);

    this._film = film;
    this._filmCardPopupComponent = new FilmCardPopupView(film);

    this._popupCloseHandler = this._popupCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this.setWatchListChangeHandler = view.setWatchListChangeHandler.bind(view);
    this.setWatchedChangeHandler = view.setWatchedChangeHandler.bind(view);
    this.setFavoriteChangeHandler = view.setFavoriteChangeHandler.bind(view);
  }

  render() {
    document.body.classList.add(`hide-overflow`);

    document.addEventListener(`keydown`, this._escKeyDownHandler);

    render(document.body, this._filmCardPopupComponent, RenderPosition.BEFOREEND);

    this._initCloseButton();
  }

  close() {
    remove(this._filmCardPopupComponent);
    document.body.classList.remove(`hide-overflow`);
  }

  isOpen() {
    return document.body.classList.contains(`hide-overflow`);
  }

  updateData(update, justDataUpdating) {
    this._filmCardPopupComponent.updateData(update, justDataUpdating);

    this._initCloseButton();
  }

  _initCloseButton() {
    this._closeButton = this._filmCardPopupComponent.getCloseButton();
    this._closeButton.addEventListener(`click`, this._popupCloseHandler);
  }

  _popupCloseHandler() {
    this._closeButton.removeEventListener(`click`, this._popupCloseHandler);
    this.close();
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this._popupCloseHandler();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
