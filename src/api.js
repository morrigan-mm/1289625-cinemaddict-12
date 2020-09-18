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
      headers: new Headers({"Content-Type": `application/json`}),
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
      .then((movies) => movies.map(Api.adaptToClient));
  }

  updateFilm(movie) {
    return this._load({
      body: JSON.stringify(Api.adaptToServer(movie)),
      headers: new Headers({"Content-Type": `application/json`}),
      method: Method.PUT,
      url: `movies/${movie.id}`
    })
      .then(Api.toJSON)
      .then(Api.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {
      body: typeof body === `object` ? JSON.stringify(body) : body,
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
}
