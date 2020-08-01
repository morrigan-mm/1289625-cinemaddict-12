import {FilmCardCount} from "./constants.js";
import {createFilmCardTemplate} from "./film-card.js";
import {createShowMoreButtonTemplate} from "./show-more-button.js";

export const createContentLayoutTemplate = (title, options = {}) => {
  const {button, extra, hiddenTitle} = options;
  const className = extra ? `films-list--extra` : `films-list`;
  const titleClassNames = [`films-list__title`];

  if (hiddenTitle) {
    titleClassNames.push(`visually-hidden`);
  }

  return (
    `<section class="${className}">
      <h2 class="${titleClassNames.join(` `)}">${title}</h2>
      <div class="films-list__container">
        ${createFilmCardTemplate().repeat(extra ? FilmCardCount.EXTRA : FilmCardCount.DEFAULT)}
      </div>
      ${button ? createShowMoreButtonTemplate() : ``}
    </section>`
  );
};
