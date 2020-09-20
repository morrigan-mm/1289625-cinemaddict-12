import FilmsModel from "../model/films.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  addComment(filmId, localComment) {
    return this._load({
      body: localComment,
      method: Method.POST,
      url: `comments/${filmId}`
    })
      .then(Api.toJSON)
      .then(({comments}) => comments);
  }

  deleteComment(commentId) {
    return this._load({
      method: Method.DELETE,
      url: `comments/${commentId}`
    });
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON);
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((movies) => movies.map(FilmsModel.adaptToClient));
  }

  updateFilm(movie) {
    return this._load({
      body: FilmsModel.adaptToServer(movie),
      method: Method.PUT,
      url: `movies/${movie.id}`
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  sync(data) {
    return this._load({
      body: data,
      method: Method.POST,
      url: `movies/sync`,
    })
      .then(Api.toJSON);
  }


  _load({
    url,
    method = Method.GET,
    body,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    if (body) {
      headers.append(`Content-Type`, `application/json`);
    }

    return fetch(`${this._endPoint}/${url}`, {
      body: body ? JSON.stringify(body) : undefined,
      headers,
      method
    })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
