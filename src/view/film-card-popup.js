import {FilmCardControl} from "../constants.js";
import SmartView from "./smart.js";
import FilmDetailsView from "./film-details.js";

const FILM_DETAILS_CONTAINER_CLASSNAME = `form-details__top-container`;
const COMMENTS_CONTAINER_CLASSNAME = `form-details__bottom-container`;
const CLOSE_BUTTON_CLASSNAME = `film-details__close-btn`;

const createFilmPopupControlTemplate = (control, text, active) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${control}" name="${control}"${active ? ` checked` : ``}>
    <label for="${control}" class="film-details__control-label film-details__control-label--${control}">${text}</label>`
  );
};

const createFilmCardPopupTemplate = (film) => {
  const {isAddedToWatchList, isWatched, isFavorite} = film;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="${FILM_DETAILS_CONTAINER_CLASSNAME}">
          <div class="film-details__close">
            <button class="${CLOSE_BUTTON_CLASSNAME}" type="button">close</button>
          </div>

          <section class="film-details__controls">
            ${createFilmPopupControlTemplate(FilmCardControl.WATCHLIST, `Add to watchlist`, isAddedToWatchList)}
            ${createFilmPopupControlTemplate(FilmCardControl.WATCHED, `Already watched`, isWatched)}
            ${createFilmPopupControlTemplate(FilmCardControl.FAVORITE, `Add to favorites`, isFavorite)}
          </section>
        </div>

        <div class="${COMMENTS_CONTAINER_CLASSNAME}"></div>
      </form>
    </section>`
  );
};

export default class FilmCardPopup extends SmartView {
  constructor({comments, film}) {
    super();

    this._data = {comments, film};

    this._watchListChangeHandler = this._watchListChangeHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._popupCloseHandler = this._popupCloseHandler.bind(this);
  }

  afterElementCreate() {
    this.renderFilmDetails();
  }

  getTemplate() {
    const {film} = this._data;
    return createFilmCardPopupTemplate(film);
  }

  restoreHandlers() {
    const {changeWatchList, changeWatched, changeFavorite, closePopup} = this._callback;

    if (changeWatchList) {
      this.setWatchListChangeHandler(changeWatchList);
    }

    if (changeWatched) {
      this.setWatchedChangeHandler(changeWatched);
    }

    if (changeFavorite) {
      this.setFavoriteChangeHandler(changeFavorite);
    }

    if (closePopup) {
      this.setPopupCloseHandler(closePopup);
    }
  }

  getCloseButton() {
    return this.getElement().querySelector(`.${CLOSE_BUTTON_CLASSNAME}`);
  }

  getCommentsContainer() {
    return this._element.querySelector(`.${COMMENTS_CONTAINER_CLASSNAME}`);
  }

  renderFilmDetails() {
    const {film} = this._data;
    const filmDetailsWrapper = this._element.querySelector(`.${FILM_DETAILS_CONTAINER_CLASSNAME}`);

    filmDetailsWrapper.insertBefore(new FilmDetailsView(film).getElement(), filmDetailsWrapper.querySelector(`.film-details__controls`));
  }

  _disableInputs() {
    this.getElement().querySelectorAll(`input`).forEach((input) => {
      input.disabled = true;
    });
  }

  _inputIsDisabled(evt) {
    return evt.target.previousElementSibling.disabled;
  }

  setWatchListChangeHandler(callback) {
    this._callback.changeWatchList = callback;
    this.getElement().querySelector(`[for="${FilmCardControl.WATCHLIST}"]`).addEventListener(`click`, this._watchListChangeHandler);
  }

  setWatchedChangeHandler(callback) {
    this._callback.changeWatched = callback;
    this.getElement().querySelector(`[for="${FilmCardControl.WATCHED}"]`).addEventListener(`click`, this._watchedChangeHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.changeFavorite = callback;
    this.getElement().querySelector(`[for="${FilmCardControl.FAVORITE}"]`).addEventListener(`click`, this._favoriteChangeHandler);
  }

  setPopupCloseHandler(callback) {
    this._callback.closePopup = callback;
    this.getCloseButton().addEventListener(`click`, this._popupCloseHandler);
  }

  _watchListChangeHandler(evt) {
    evt.preventDefault();

    if (!this._inputIsDisabled(evt)) {
      this._callback.changeWatchList();
    }
    this._disableInputs();
  }

  _watchedChangeHandler(evt) {
    evt.preventDefault();

    if (!this._inputIsDisabled(evt)) {
      this._callback.changeWatched();
    }
    this._disableInputs();
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();

    if (!this._inputIsDisabled(evt)) {
      this._callback.changeFavorite();
    }
    this._disableInputs();
  }

  _popupCloseHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup();
  }
}
