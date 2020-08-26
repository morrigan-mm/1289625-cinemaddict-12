import AbstractView from "./abstract.js";

const FILMS_CONTAINER_CLASSNAME = `films-list__container`;

const createTopRatedFilmsTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="${FILMS_CONTAINER_CLASSNAME}"></div>
    </section>`
  );
};

export default class TopRatedFilms extends AbstractView {
  getTemplate() {
    return createTopRatedFilmsTemplate();
  }

  getFilmsContainer() {
    return this.getElement().querySelector(`.${FILMS_CONTAINER_CLASSNAME}`);
  }
}
