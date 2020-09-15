import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor(filmId) {
    super();

    this._filmId = filmId;
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();

    this._notify(this._filmId);
  }

  getComments() {
    return this._comments;
  }

  addComment(comment) {
    this._comments.push(comment);

    this._notify(this._filmId);
  }

  deleteComment(id) {
    this._comments = this._comments.filter((comment) => comment.id !== id);

    this._notify(this._filmId);
  }
}
