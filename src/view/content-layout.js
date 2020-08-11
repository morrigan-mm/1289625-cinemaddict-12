import {createFilmCardTemplate} from "./film-card.js";

export const createContentLayoutTemplate = (title, films, options = {}) => {
  const {extra, hiddenTitle} = options;
  const className = extra ? `films-list--extra` : `films-list`;
  const titleClassNames = [`films-list__title`];
  const filmList = films.map(createFilmCardTemplate);

  if (hiddenTitle) {
    titleClassNames.push(`visually-hidden`);
  }

  return (
    `<section class="${className}">
      <h2 class="${titleClassNames.join(` `)}">${title}</h2>
      <div class="films-list__container">
        ${filmList.join(``)}
      </div>
    </section>`
  );
};
