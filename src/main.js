import HeaderProfileView from "./view/header-profile.js";
import MainNavigationView from "./view/main-navigation.js";
import SortingView from "./view/sorting.js";
import ContainerView from "./view/container.js";
import ContentLayoutView from "./view/content-layout.js";
import FilmCardView from "./view/film-card.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmCardPopupView from "./view/film-card-popup.js";
import {FilmCardCount} from "./constants.js";
import {sortBy, render, RenderPosition} from "./utils.js";

import {generateFilmCard} from "./mock/film-card.js";
import {generateFilter} from "./mock/filter.js";

const films = new Array(FilmCardCount.MOCK_COUNT).fill().map(generateFilmCard);
const topRatedFilms = sortBy(films, (film) => film.rating);
const mostCommentedFilms = sortBy(films, (film) => film.comments.length);
const primaryFilms = films.length > FilmCardCount.DEFAULT
  ? films.slice(0, FilmCardCount.DEFAULT)
  : films;

const filters = generateFilter(films);

const renderFilmCard = (filmListElement, film) => {

  const onElementInteract = () => {
    const filmPopupComponent = new FilmCardPopupView(film);
    body.classList.add(`hide-overflow`);

    const closeButton = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);

    closeButton.addEventListener(`click`, () => {
      body.classList.remove(`hide-overflow`);
      filmPopupComponent.getElement().remove();
      filmPopupComponent.removeElement();

    });

    render(body, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
  };

  const filmCardComponent = new FilmCardView(film);
  const filmTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const filmPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const filmComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);

  filmTitle.addEventListener(`click`, () => {
    onElementInteract();
  });

  filmPoster.addEventListener(`click`, () => {
    onElementInteract();
  });

  filmComments.addEventListener(`click`, () => {
    onElementInteract();
  });

  render(filmListElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, new HeaderProfileView().getElement(), RenderPosition.BEFOREEND);

const main = body.querySelector(`.main`);
render(main, new MainNavigationView(filters).getElement(), RenderPosition.AFTERBEGIN);
render(main, new SortingView().getElement(), RenderPosition.BEFOREEND);

const content = new ContainerView();
render(main, content.getElement(), RenderPosition.BEFOREEND);

const primaryLayout = new ContentLayoutView(`All movies. Upcoming`, {hiddenTitle: true});
primaryFilms.forEach((film) => renderFilmCard(primaryLayout.getContainer(), film));

const topRatedLayout = new ContentLayoutView(`Top rated`, {extra: true});
topRatedFilms.slice(0, FilmCardCount.EXTRA).forEach((film) => renderFilmCard(topRatedLayout.getContainer(), film));

const mostCommentedLayout = new ContentLayoutView(`Most commented`, {extra: true});
mostCommentedFilms.slice(0, FilmCardCount.EXTRA).forEach((film) => renderFilmCard(mostCommentedLayout.getContainer(), film));

render(content.getElement(), primaryLayout.getElement(), RenderPosition.BEFOREEND);
render(content.getElement(), topRatedLayout.getElement(), RenderPosition.BEFOREEND);
render(content.getElement(), mostCommentedLayout.getElement(), RenderPosition.BEFOREEND);

if (films.length > FilmCardCount.DEFAULT) {
  const moreButtonView = new ShowMoreButtonView();

  let renderedFilmCount = FilmCardCount.DEFAULT;

  render(primaryLayout.getElement(), moreButtonView.getElement(), RenderPosition.BEFOREEND);

  moreButtonView.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FilmCardCount.DEFAULT)
      .forEach((film) => renderFilmCard(primaryLayout.getContainer(), film));

    renderedFilmCount += FilmCardCount.DEFAULT;

    if (renderedFilmCount >= films.length) {
      moreButtonView.getElement().remove();
      moreButtonView.removeElement();
    }
  });
}

const footerStatistics = body.querySelector(`.footer__statistics`);
render(footerStatistics, new FooterStatisticsView(filters[0].count).getElement(), RenderPosition.BEFOREEND);
