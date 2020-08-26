import AbstractView from "./abstract.js";

const FILMS_CONTAINER_CLASSNAME = `films-list__container`;

const createAllFilmsTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="${FILMS_CONTAINER_CLASSNAME}"></div>
    </section>`
  );
};

export default class AllFilms extends AbstractView {
  getTemplate() {
    return createAllFilmsTemplate();
  }

  getFilmsContainer() {
    return this.getElement().querySelector(`.${FILMS_CONTAINER_CLASSNAME}`);
  }
}
