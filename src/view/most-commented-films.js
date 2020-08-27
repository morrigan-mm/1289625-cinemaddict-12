import AbstractView from "./abstract.js";

const FILMS_CONTAINER_CLASSNAME = `films-list__container`;

const createMostCommentedFilmsTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="${FILMS_CONTAINER_CLASSNAME}"></div>
    </section>`
  );
};

export default class TopRatedFilms extends AbstractView {
  getTemplate() {
    return createMostCommentedFilmsTemplate();
  }

  getFilmsContainer() {
    return this.getElement().querySelector(`.${FILMS_CONTAINER_CLASSNAME}`);
  }
}
