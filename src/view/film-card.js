import AbstractView from "./abstract.js";
import classNames from "classnames";

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

  return (
    `<article class="film-card">
      <h3 class="${TITLE_CLASSNAME}">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${filmGenre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="${POSTER_CLASSNAME}">
      <p class="film-card__description">${descriptionText}</p>
      <a class="${COMMENTS_CLASSNAME}">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button ${getButtonClassName(`add-to-watchlist`, isAddedToWatchList)}">Add to watchlist</button>
        <button class="film-card__controls-item button ${getButtonClassName(`mark-as-watched`, isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button ${getButtonClassName(`favorite`, isFavorite)}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film, maxDescLength = MAX_DESC_LENGTH) {
    super();

    this._film = film;
    this._maxDescLength = maxDescLength;

    this._filmDetailsClickHandler = this._filmDetailsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._maxDescLength);
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

  _filmDetailsClickHandler(evt) {
    const filmTitle = this.getFilmTitle();
    const filmPoster = this.getFilmPoster();
    const filmComments = this.getFilmComments();

    if (evt.target === filmTitle || evt.target === filmPoster || evt.target === filmComments) {
      this._callback.click();
    }
  }

  setFilmDetailsClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._filmDetailsClickHandler);
  }
}
