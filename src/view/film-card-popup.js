import CommentListView from "./comment-list.js";
import FilmDetailsView from "./film-details.js";
import {createElement} from "../utils.js";

const FILM_DETAILS_CONTAINER_CLASSNAME = `form-details__top-container`;
const COMMENT_LIST_CONTAINER_CLASSNAME = `form-details__bottom-container`;

const createFilmPopupControlTemplate = (name, text, active) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}"${active ? ` checked` : ``}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${text}</label>`
  );
};

const createFilmCardPopupTemplate = (film) => {
  const {isAddedToWatchList, isWatched, isFavorite} = film;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="${FILM_DETAILS_CONTAINER_CLASSNAME}">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>

          <section class="film-details__controls">
            ${createFilmPopupControlTemplate(`watchlist`, `Add to watchlist`, isAddedToWatchList)}
            ${createFilmPopupControlTemplate(`watched`, `Already watched`, isWatched)}
            ${createFilmPopupControlTemplate(`favorite`, `Add to favorites`, isFavorite)}
          </section>
        </div>

        <div class="${COMMENT_LIST_CONTAINER_CLASSNAME}"></div>
      </form>
    </section>`
  );
};

export default class FilmCardPopup {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardPopupTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      const filmDetailsWrapper = this._element.querySelector(`.${FILM_DETAILS_CONTAINER_CLASSNAME}`);
      filmDetailsWrapper.insertBefore(new FilmDetailsView(this._film).getElement(), filmDetailsWrapper.querySelector(`.film-details__controls`));
      const commentListWrapper = this._element.querySelector(`.${COMMENT_LIST_CONTAINER_CLASSNAME}`);
      commentListWrapper.appendChild(new CommentListView(this._film.comments).getElement());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
