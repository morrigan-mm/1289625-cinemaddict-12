import {updateListItem} from "../utils/common.js";
import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  updateFilm(film) {
    this._films = updateListItem(this._films, film);

    this._notify(film);
  }

  getFilms() {
    return this._films;
  }

  getFilm(id) {
    return this._films.find((film) => film.id === id);
  }
}
