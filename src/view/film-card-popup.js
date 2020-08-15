import {createFilmDetailsTemplate} from "./film-details.js";
import {createCommentListTemplate} from "./comment-list.js";

const createFilmPopupControlTemplate = (name, text, active) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}"${active ? ` checked` : ``}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${text}</label>`
  );
};

export const createFilmCardPopupTemplate = (film) => {
  const {isAddedToWatchList, isWatched, isFavorite} = film;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          ${createFilmDetailsTemplate(film)}
          <section class="film-details__controls">
            ${createFilmPopupControlTemplate(`watchlist`, `Add to watchlist`, isAddedToWatchList)}
            ${createFilmPopupControlTemplate(`watched`, `Already watched`, isWatched)}
            ${createFilmPopupControlTemplate(`favorite`, `Add to favorites`, isFavorite)}
          </section>
        </div>

        <div class="form-details__bottom-container">
          ${createCommentListTemplate(film.comments)}
        </div>
      </form>
    </section>`
  );
};
