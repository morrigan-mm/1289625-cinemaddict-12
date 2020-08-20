import {createElement} from "../utils.js";

const FILMS_CONTAINER_CLASSNAME = `films-list__container`;

const createFilmsSectionTemplate = (title, options) => {
  const {extra, hiddenTitle} = options;
  const className = extra ? `films-list--extra` : `films-list`;
  const titleClassNames = [`films-list__title`];

  if (hiddenTitle) {
    titleClassNames.push(`visually-hidden`);
  }

  return (
    `<section class="${className}">
      <h2 class="${titleClassNames.join(` `)}">${title}</h2>
      <div class="${FILMS_CONTAINER_CLASSNAME}"></div>
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

  getFilmsContainer() {
    return this.getElement().querySelector(`.${FILMS_CONTAINER_CLASSNAME}`);
  }

  removeElement() {
    this._element = null;
  }
}
