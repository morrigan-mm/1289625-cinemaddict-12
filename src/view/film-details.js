import AbstractView from "./abstract.js";
import {DateFormat} from "../constants.js";
import {capitalize, formatDate, formatDuration} from "../utils/common.js";

const createGenresTemplate = (genres) => {
  return genres
    .map((genre) => `<span class="film-details__genre">${capitalize(genre)}</span>`)
    .join(``);
};

const createFilmDetailsTemplate = (film) => {
  const {title, originalTitle, rating, description, poster, director, writers, actors, releaseDate, duration, country, genres, age} = film;

  const release = formatDate(releaseDate, DateFormat.CALENDAR);

  const genresTitle = genres.length > 1
    ? `Genres`
    : `Genre`;

  const genresList = createGenresTemplate(genres);

  const filmDuration = formatDuration(duration);

  return (
    `<div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

        <p class="film-details__age">${age}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${originalTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${rating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${release}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${filmDuration}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${genresTitle}</td>
            <td class="film-details__cell">
              ${genresList}
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">
          ${description}
        </p>
      </div>
    </div>`
  );
};

export default class FilmDetails extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }
}
