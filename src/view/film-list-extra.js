import AbstractView from "./abstract.js";

const FILMS_CONTAINER_CLASSNAME = `films-list__container`;

const createMostCommentedFilmsTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="${FILMS_CONTAINER_CLASSNAME}"></div>
    </section>`
  );
};

export default class TopRatedFilms extends AbstractView {
  constructor(title) {
    super();

    this._title = title;
  }

  getTemplate() {
    return createMostCommentedFilmsTemplate(this._title);
  }

  getFilmsContainer() {
    return this.getElement().querySelector(`.${FILMS_CONTAINER_CLASSNAME}`);
  }
}
