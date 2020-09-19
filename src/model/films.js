import {UserRank} from "../constants.js";
import {updateListItem} from "../utils/common.js";
import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor({loading}) {
    super();

    this._loading = loading;
    this._films = [];
    this._rank = Films.getRank(this._films);
  }

  setFilms(films) {
    this._loading = false;
    this._films = films.slice();
    this._rank = Films.getRank(this._films);

    this._notify(films);
  }

  updateFilm(film) {
    this._films = updateListItem(this._films, film);
    this._rank = Films.getRank(this._films);

    this._notify(film);
  }

  getFilms() {
    return this._films;
  }

  getFilm(id) {
    return this._films.find((film) => film.id === id);
  }

  getLoading() {
    return this._loading;
  }

  getRank() {
    return this._rank;
  }

  static adaptToClient({comments, film_info: info, user_details: user, id}) {
    return {
      id,
      title: info.title,
      originalTitle: info.alternative_title,
      poster: info.poster,
      director: info.director,
      writers: info.writers,
      actors: info.actors,
      releaseDate: info.release.date,
      country: info.release.release_country,
      duration: info.runtime,
      genres: info.genre,
      description: info.description,
      rating: info.total_rating,
      age: info.age_rating,
      comments,
      watchingDate: user.watching_date,
      isAddedToWatchList: user.watchlist,
      isWatched: user.already_watched,
      isFavorite: user.favorite
    };
  }

  static adaptToServer(movie) {
    return {
      "comments": movie.comments,
      "film_info": {
        "actors": movie.actors,
        "age_rating": movie.age,
        "alternative_title": movie.originalTitle,
        "description": movie.description,
        "director": movie.director,
        "genre": movie.genres,
        "poster": movie.poster,
        "release": {
          "date": movie.releaseDate,
          "release_country": movie.country
        },
        "runtime": movie.duration,
        "title": movie.title,
        "total_rating": movie.rating,
        "writers": movie.writers
      },
      "user_details": {
        "already_watched": movie.isWatched,
        "favorite": movie.isFavorite,
        "watching_date": movie.watchingDate,
        "watchlist": movie.isAddedToWatchList
      },
      "id": movie.id
    };
  }

  static getRank(films) {
    const watchedCount = films.filter(({isWatched}) => isWatched).length;

    if (watchedCount > 20) {
      return UserRank.MOVIE_BUFF;
    }

    if (watchedCount > 10) {
      return UserRank.FAN;
    }

    if (watchedCount > 0) {
      return UserRank.NOVICE;
    }

    return null;
  }
}
