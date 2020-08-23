import HeaderProfileView from "./view/header-profile.js";
import MainNavigationView from "./view/main-navigation.js";
import SortingView from "./view/sorting.js";
import FilmsContainerView from "./view/films-container.js";
import FilmsSectionView from "./view/films-section.js";
import FilmCardView from "./view/film-card.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmCardPopupView from "./view/film-card-popup.js";
import {FilmCardCount} from "./constants.js";
import {sortBy, render, RenderPosition} from "./utils.js";

import {generateFilmCard} from "./mock/film-card.js";
import {generateFilter} from "./mock/filter.js";

const films = new Array(FilmCardCount.MOCK_COUNT).fill().map(generateFilmCard);
const filters = generateFilter(films);

const renderFilmCard = (filmListElement, film) => {

  const onElementInteract = () => {
    const filmPopupComponent = new FilmCardPopupView(film);
    body.classList.add(`hide-overflow`);

    const onPopupClose = () => {
      body.classList.remove(`hide-overflow`);
      filmPopupComponent.getElement().remove();
      filmPopupComponent.removeElement();
      closeButton.removeEventListener(`click`, onPopupClose);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        onPopupClose();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const closeButton = filmPopupComponent.getCloseButton();

    closeButton.addEventListener(`click`, onPopupClose);
    document.addEventListener(`keydown`, onEscKeyDown);

    render(body, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
  };

  const filmCardComponent = new FilmCardView(film);
  const filmTitle = filmCardComponent.getFilmTitle();
  const filmPoster = filmCardComponent.getFilmPoster();
  const filmComments = filmCardComponent.getFilmComments();

  filmCardComponent.getElement().addEventListener(`click`, (evt) => {
    if (evt.target === filmTitle || evt.target === filmPoster || evt.target === filmComments) {
      onElementInteract();
    }
  });

  render(filmListElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, new HeaderProfileView().getElement(), RenderPosition.BEFOREEND);

const main = body.querySelector(`.main`);
render(main, new MainNavigationView(filters).getElement(), RenderPosition.AFTERBEGIN);
render(main, new SortingView().getElement(), RenderPosition.BEFOREEND);

const content = new FilmsContainerView();
render(main, content.getElement(), RenderPosition.BEFOREEND);

if (!films.length) {
  const noFilmLayout = new FilmsSectionView(`There are no movies in our database`, {hiddenTitle: false, noContainer: true});
  render(content.getElement(), noFilmLayout.getElement(), RenderPosition.AFTERBEGIN);
} else {
  const topRatedFilms = sortBy(films, (film) => film.rating);
  const mostCommentedFilms = sortBy(films, (film) => film.comments.length);
  const primaryFilms = films.length > FilmCardCount.DEFAULT
    ? films.slice(0, FilmCardCount.DEFAULT)
    : films;

  const primaryLayout = new FilmsSectionView(`All movies. Upcoming`, {hiddenTitle: true});
  primaryFilms.forEach((film) => renderFilmCard(primaryLayout.getFilmsContainer(), film));

  const topRatedLayout = new FilmsSectionView(`Top rated`, {extra: true});
  topRatedFilms.slice(0, FilmCardCount.EXTRA).forEach((film) => renderFilmCard(topRatedLayout.getFilmsContainer(), film));

  const mostCommentedLayout = new FilmsSectionView(`Most commented`, {extra: true});
  mostCommentedFilms.slice(0, FilmCardCount.EXTRA).forEach((film) => renderFilmCard(mostCommentedLayout.getFilmsContainer(), film));

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
        .forEach((film) => renderFilmCard(primaryLayout.getFilmsContainer(), film));

      renderedFilmCount += FilmCardCount.DEFAULT;

      if (renderedFilmCount >= films.length) {
        moreButtonView.getElement().remove();
        moreButtonView.removeElement();
      }
    });
  }
}

const footerStatistics = body.querySelector(`.footer__statistics`);
render(footerStatistics, new FooterStatisticsView(filters[0].count).getElement(), RenderPosition.BEFOREEND);
