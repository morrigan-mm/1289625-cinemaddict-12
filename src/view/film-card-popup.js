import {copy} from "../utils/common.js";
import {FilmCardControl} from "../constants.js";
import SmartView from "./smart.js";
import CommentListView from "./comment-list.js";
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
  constructor(film) {
    super();

    this._data = copy(film);
    this._comments = film.comments.slice();

    this._handleWatchListChange = this._handleWatchListChange.bind(this);
    this._handleWatchedChange = this._handleWatchedChange.bind(this);
    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
  }

  getTemplate() {
    return createFilmCardPopupTemplate(this._data);
  }

  afterElementCreate() {
    this.renderFilmDetails();
    this.renderComments();
  }

  restoreHandlers() {
    const {changeWatchList, changeWatched, changeFavorite} = this._callback;

    if (changeWatchList) {
      this.setWatchListChangeHandler(changeWatchList);
    }

    if (changeWatched) {
      this.setWatchedChangeHandler(changeWatched);
    }

    if (changeFavorite) {
      this.setFavoriteChangeHandler(changeFavorite);
    }
  }

  _handleWatchListChange(evt) {
    evt.preventDefault();
    this._callback.changeWatchList();
  }

  _handleWatchedChange(evt) {
    evt.preventDefault();
    this._callback.changeWatched();
  }

  _handleFavoriteChange(evt) {
    evt.preventDefault();
    this._callback.changeFavorite();
  }

  setWatchListChangeHandler(callback) {
    this._callback.changeWatchList = callback;
    this.getElement().querySelector(`[name="${FilmCardControl.WATCHLIST}"]`).addEventListener(`change`, this._handleWatchListChange);
  }

  setWatchedChangeHandler(callback) {
    this._callback.changeWatched = callback;
    this.getElement().querySelector(`[name="${FilmCardControl.WATCHED}"]`).addEventListener(`change`, this._handleWatchedChange);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.changeFavorite = callback;
    this.getElement().querySelector(`[name="${FilmCardControl.FAVORITE}"]`).addEventListener(`change`, this._handleFavoriteChange);
  }

  getCloseButton() {
    return this.getElement().querySelector(`.${CLOSE_BUTTON_CLASSNAME}`);
  }

  renderFilmDetails() {
    const filmDetailsWrapper = this._element.querySelector(`.${FILM_DETAILS_CONTAINER_CLASSNAME}`);

    filmDetailsWrapper.insertBefore(new FilmDetailsView(this._data).getElement(), filmDetailsWrapper.querySelector(`.film-details__controls`));
  }

  renderComments() {
    const commentsWrapper = this._element.querySelector(`.${COMMENTS_CONTAINER_CLASSNAME}`);

    commentsWrapper.appendChild(new CommentListView(this._comments).getElement());
  }
}
