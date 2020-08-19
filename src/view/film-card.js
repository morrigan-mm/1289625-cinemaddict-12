import classNames from "classnames";
import {createElement} from "../utils.js";

const MAX_DESC_LENGTH = 140;

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
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${filmGenre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionText}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button ${getButtonClassName(`add-to-watchlist`, isAddedToWatchList)}">Add to watchlist</button>
        <button class="film-card__controls-item button ${getButtonClassName(`mark-as-watched`, isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button ${getButtonClassName(`favorite`, isFavorite)}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard {
  constructor(film, maxDescLength = MAX_DESC_LENGTH) {
    this._film = film;
    this._maxDescLength = maxDescLength;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._maxDescLength);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
