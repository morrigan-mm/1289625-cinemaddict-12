import FilmsModel from "../model/films.js";
import {isOnline} from "../utils/common.js";

const createStoreStructure = (items) => {
  return items.reduce((store, item) => {
    return Object.assign({}, store, {
      [item.id]: item,
    });
  }, {});
};

export default class Provider {
  constructor(api, filmsStore, commentsStore) {
    this._api = api;
    this._filmsStore = filmsStore;
    this._commentsStore = commentsStore;
  }

  addComment(filmId, localComment) {
    if (isOnline()) {
      return this._api.addComment(filmId, localComment);
    }

    return Promise.reject(new Error(`Add comment failed`));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          comments.forEach((comment) => this._commentsStore.setItem(comment.id, comment));
          return comments;
        });
    }

    const storeFilm = this._filmsStore.getItem(filmId);

    if (storeFilm) {
      const storeComments = Object.values(this._commentsStore.getItems());
      const storeFilmComments = storeComments.filter(({id}) => storeFilm.comments.includes(id));
      return Promise.resolve(storeFilmComments);
    }

    return Promise.reject(new Error(`Get comments failed`));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._filmsStore.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._filmsStore.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._filmsStore.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._filmsStore.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._filmsStore.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const items = createStoreStructure(response.updated);

          this._filmsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
