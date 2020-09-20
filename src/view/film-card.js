import classNames from "classnames";
import {copy, formatDuration} from "../utils/common.js";
import SmartView from "./smart.js";
import {FilmCardControl} from "../constants.js";

const MAX_DESC_LENGTH = 140;

const POSTER_CLASSNAME = `film-card__poster`;
const TITLE_CLASSNAME = `film-card__title`;
const COMMENTS_CLASSNAME = `film-card__comments`;

const getButtonClassName = (type, active) => {
  return classNames(
      `button`,
      `film-card__controls-item`,
      `film-card__controls-item--${type}`,
      (active && `film-card__controls-item--active`)
  );
};

const createFilmCardTemplate = (film, maxDescLength) => {
  const {title, rating, description, poster, releaseDate, duration, genres, comments, isAddedToWatchList, isWatched, isFavorite} = film;
  const [filmGenre] = genres;
  const commentsCount = comments.length;

  const descriptionText = description.length > maxDescLength
    ? `${description.slice(0, maxDescLength)}…`
    : description;

  const releaseYear = new Date(releaseDate).getFullYear();

  const filmDuration = formatDuration(duration);

  return (
    `<article class="film-card">
      <h3 class="${TITLE_CLASSNAME}">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${filmGenre || ``}</span>
      </p>
      <img src="${poster}" alt="" class="${POSTER_CLASSNAME}">
      <p class="film-card__description">${descriptionText}</p>
      <a class="${COMMENTS_CLASSNAME}">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button data-control="${FilmCardControl.WATCHLIST}" class="film-card__controls-item button ${getButtonClassName(`add-to-watchlist`, isAddedToWatchList)}">Add to watchlist</button>
        <button data-control="${FilmCardControl.WATCHED}" class="film-card__controls-item button ${getButtonClassName(`mark-as-watched`, isWatched)}">Mark as watched</button>
        <button data-control="${FilmCardControl.FAVORITE}" class="film-card__controls-item button ${getButtonClassName(`favorite`, isFavorite)}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends SmartView {
  constructor(film, maxDescLength = MAX_DESC_LENGTH) {
    super();

    this._data = copy(film);
    this._maxDescLength = maxDescLength;

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._data, this._maxDescLength);
  }

  restoreHandlers() {
    const {clickCard, clickFavorite, clickWatchList, clickWatched} = this._callback;

    if (clickCard) {
      this.setCardClickHandler(clickCard);
    }

    if (clickWatchList) {
      this.setWatchListClickHandler(clickWatchList);
    }

    if (clickWatched) {
      this.setWatchedClickHandler(clickWatched);
    }

    if (clickFavorite) {
      this.setFavoriteClickHandler(clickFavorite);
    }
  }

  getFilmPoster() {
    return this.getElement().querySelector(`.${POSTER_CLASSNAME}`);
  }

  getFilmTitle() {
    return this.getElement().querySelector(`.${TITLE_CLASSNAME}`);
  }

  getFilmComments() {
    return this.getElement().querySelector(`.${COMMENTS_CLASSNAME}`);
  }

  _disableButtons() {
    this.getElement().querySelectorAll(`button`).forEach((button) => {
      button.disabled = true;
    });
  }

  setWatchListClickHandler(callback) {
    this._callback.clickWatchList = callback;
    this.getElement().querySelector(`[data-control="${FilmCardControl.WATCHLIST}"]`).addEventListener(`click`, this._handleWatchListClick);
  }

  setWatchedClickHandler(callback) {
    this._callback.clickWatched = callback;
    this.getElement().querySelector(`[data-control="${FilmCardControl.WATCHED}"]`).addEventListener(`click`, this._handleWatchedClick);
  }

  setFavoriteClickHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement().querySelector(`[data-control="${FilmCardControl.FAVORITE}"]`).addEventListener(`click`, this._handleFavoriteClick);
  }

  setCardClickHandler(callback) {
    this._callback.clickCard = callback;
    this.getElement().addEventListener(`click`, this._handleCardClick);
  }

  _handleCardClick(evt) {
    const filmTitle = this.getFilmTitle();
    const filmPoster = this.getFilmPoster();
    const filmComments = this.getFilmComments();

    if (evt.target === filmTitle || evt.target === filmPoster || evt.target === filmComments) {
      this._callback.clickCard();
    }
  }

  _handleWatchListClick(evt) {
    evt.preventDefault();
    this._disableButtons();
    this._callback.clickWatchList();
  }

  _handleWatchedClick(evt) {
    evt.preventDefault();
    this._disableButtons();
    this._callback.clickWatched();
  }

  _handleFavoriteClick(evt) {
    evt.preventDefault();
    this._disableButtons();
    this._callback.clickFavorite();
  }
}
