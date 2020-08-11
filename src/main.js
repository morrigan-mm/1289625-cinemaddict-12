import {createHeaderProfileTemplate} from "./view/header-profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createContainerTemplate} from "./view/container.js";
import {createContentLayoutTemplate} from "./view/content-layout.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createFooterStatisticsTemplate} from "./view/footer-statistics.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmCardPopupTemplate} from "./view/film-card-popup.js";
import {FilmCardCount} from "./constants.js";

import {generateFilmCard} from "./mock/film-card.js";
import {generateFilter} from "./mock/filter.js";

const MOCK_COUNT = 20;

const films = new Array(MOCK_COUNT).fill().map(generateFilmCard);
const topRatedFilms = films.slice().sort((min, max) => max.rating - min.rating).slice(0, FilmCardCount.EXTRA);
const mostCommentedFilms = films.slice().sort((min, max) => max.comments.length - min.comments.length).slice(0, FilmCardCount.EXTRA);
const primaryFilms = films.length > FilmCardCount.DEFAULT
  ? films.slice(0, FilmCardCount.DEFAULT)
  : films;

const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, createHeaderProfileTemplate(), `beforeend`);

const main = body.querySelector(`.main`);
render(main, createMainNavigationTemplate(filters), `beforeend`);
render(main, createSortingTemplate(), `beforeend`);
render(main, createContainerTemplate(), `beforeend`);

const content = main.querySelector(`.films`);

render(content, createContentLayoutTemplate(`All movies. Upcoming`, primaryFilms, {hiddenTitle: true}), `beforeend`);
render(content, createContentLayoutTemplate(`Top rated`, topRatedFilms, {extra: true}), `beforeend`);
render(content, createContentLayoutTemplate(`Most commented`, mostCommentedFilms, {extra: true}), `beforeend`);

if (films.length > FilmCardCount.DEFAULT) {
  let renderedFilmCount = FilmCardCount.DEFAULT;
  const innerContainer = content.querySelector(`.films-list`);
  const filmsContainer = innerContainer.querySelector(`.films-list__container`);
  render(innerContainer, createShowMoreButtonTemplate(), `beforeend`);

  const showMoreButton = innerContainer.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FilmCardCount.DEFAULT)
      .forEach((film) => render(filmsContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += FilmCardCount.DEFAULT;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const footerStatistics = body.querySelector(`.footer__statistics`);
render(footerStatistics, createFooterStatisticsTemplate(filters[0].count), `beforeend`);

body.classList.add(`hide-overflow`);
render(body, createFilmCardPopupTemplate(films[0]), `beforeend`);
