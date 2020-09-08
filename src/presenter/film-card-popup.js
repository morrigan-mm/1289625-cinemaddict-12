import FilmCardPopupView from "../view/film-card-popup.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {isEscKey} from "../utils/keyboard.js";
import {UserAction} from "../constants.js";

export default class FilmCardPopup {
  constructor(film, onUserAction) {
    this._film = film;

    this._filmCardPopupComponent = new FilmCardPopupView(film);
    this._onUserAction = onUserAction;

    this._handlePopupClose = this._handlePopupClose.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleWatchListChange = this._handleWatchListChange.bind(this);
    this._handleWatchedChange = this._handleWatchedChange.bind(this);
    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
  }

  render() {
    document.body.classList.add(`hide-overflow`);

    document.addEventListener(`keydown`, this._handleEscKeyDown);

    render(document.body, this._filmCardPopupComponent, RenderPosition.BEFOREEND);

    this._filmCardPopupComponent.setWatchListChangeHandler(this._handleWatchListChange);
    this._filmCardPopupComponent.setWatchedChangeHandler(this._handleWatchedChange);
    this._filmCardPopupComponent.setFavoriteChangeHandler(this._handleFavoriteChange);
    this._filmCardPopupComponent.setPopupCloseHandler(this._handlePopupClose);
  }

  close() {
    remove(this._filmCardPopupComponent);

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.body.classList.remove(`hide-overflow`);
  }

  isOpen() {
    return document.body.classList.contains(`hide-overflow`);
  }

  updateData(update) {
    this._filmCardPopupComponent.updateData(update);
  }

  _handlePopupClose() {
    this.close();
  }

  _handleEscKeyDown(evt) {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.close();
    }
  }

  _handleWatchListChange() {
    this._onUserAction(UserAction.TOGGLE_WATCHLIST, this._film);
  }

  _handleWatchedChange() {
    this._onUserAction(UserAction.TOGGLE_WATCHED, this._film);
  }

  _handleFavoriteChange() {
    this._onUserAction(UserAction.TOGGLE_FAVORITE, this._film);
  }
}
