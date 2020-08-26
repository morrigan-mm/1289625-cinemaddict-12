import AbstractView from "./abstract.js";

const createFilmListTemplate = () => {
  return `<section class="films"></section>`;
};

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
