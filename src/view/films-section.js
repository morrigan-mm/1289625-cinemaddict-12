import {createElement} from "../utils.js";

const FILMS_CONTAINER_CLASSNAME = `films-list__container`;

const createFilmsSectionTemplate = (title, options) => {
  const {extra, hiddenTitle, noContainer} = options;
  const className = extra ? `films-list--extra` : `films-list`;
  const titleClassNames = [`films-list__title`];
  const containerHtml = noContainer ? `` : `<div class="${FILMS_CONTAINER_CLASSNAME}"></div>`;

  if (hiddenTitle) {
    titleClassNames.push(`visually-hidden`);
  }

  return (
    `<section class="${className}">
      <h2 class="${titleClassNames.join(` `)}">${title}</h2>
      ${containerHtml}
    </section>`
  );
};

export default class FilmsSection {
  constructor(title, options = {}) {
    this._title = title;
    this._options = options;
    this._element = null;
  }

  getTemplate() {
    return createFilmsSectionTemplate(this._title, this._options);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getFilmsContainer() {
    return this.getElement().querySelector(`.${FILMS_CONTAINER_CLASSNAME}`);
  }
}
