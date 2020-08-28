import FilmsListView from "../view/films-list.js";
import AllFilmsView from "../view/all-films.js";
import NoFilmsView from "../view/no-films.js";
import TopRatedFilmsView from "../view/top-rated-films.js";
import MostCommentedFilmsView from "../view/most-commented-films.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmCardPopupView from "../view/film-card-popup.js";
import SortingView from "../view/sorting.js";

import {FilmCardCount, SortType} from "../constants.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortBy} from "../utils/common.js";
import {isEscKey} from "../utils/keyboard.js";

export default class FilmList {
  constructor(films, filmListContainer) {
    this._films = films;
    this._container = filmListContainer;

    this._allFilms = [];
    this._renderedFilmsCount = 0;
    this._sortType = SortType.DEFAULT;

    this._sortingComponent = new SortingView(this._sortType);
    this._filmListComponent = new FilmsListView();
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedFilmsComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  render() {
    this._renderSorting();

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderContent();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        return sortBy(this._films, (film) => film.releaseDate);
      case SortType.RATING:
        return sortBy(this._films, (film) => film.rating);
      default:
        return this._films.slice();
    }
  }

  _handleSortTypeChange(sortType) {
    this._allFilms = this._sortFilms(sortType);
    this._sortType = sortType;

    this._renderAllFilms();
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContent() {
    if (!this._films.length) {
      this._renderNoFilms();

      return;
    }

    this._allFilms = this._sortFilms(this._sortType);

    const topRatedFilms = sortBy(this._films, (film) => film.rating);
    const mostCommentedFilms = sortBy(this._films, (film) => film.comments.length);

    this._renderAllFilms();
    this._renderTopRatedFilms(topRatedFilms);
    this._renderMostCommentedFilms(mostCommentedFilms);
  }

  _renderNoFilms() {
    render(this._filmListComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderAllFilms() {
    remove(this._allFilmsComponent);

    const filmsToRender = this._allFilms.slice(0, FilmCardCount.DEFAULT);

    filmsToRender.forEach((film) => this._renderFilmCard(this._allFilmsComponent.getFilmsContainer(), film));

    this._renderedFilmsCount = filmsToRender.length;

    if (this._renderedFilmsCount < this._allFilms.length) {
      this._renderShowMoreButton();
    }

    render(this._filmListComponent, this._allFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTopRatedFilms(films) {
    films.slice(0, FilmCardCount.EXTRA)
      .forEach((film) => this._renderFilmCard(this._topRatedFilmsComponent.getFilmsContainer(), film));

    render(this._filmListComponent, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilms(films) {
    films.slice(0, FilmCardCount.EXTRA)
      .forEach((film) => this._renderFilmCard(this._mostCommentedFilmsComponent.getFilmsContainer(), film));

    render(this._filmListComponent, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(filmListElement, film) {
    const filmCardComponent = new FilmCardView(film);

    const onElementInteract = () => {
      const filmPopupComponent = new FilmCardPopupView(film);
      document.body.classList.add(`hide-overflow`);

      const onPopupClose = () => {
        document.body.classList.remove(`hide-overflow`);
        remove(filmPopupComponent);
        closeButton.removeEventListener(`click`, onPopupClose);
      };

      const onEscKeyDown = (evt) => {
        if (isEscKey(evt)) {
          evt.preventDefault();
          onPopupClose();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      const closeButton = filmPopupComponent.getCloseButton();

      closeButton.addEventListener(`click`, onPopupClose);
      document.addEventListener(`keydown`, onEscKeyDown);

      render(document.body, filmPopupComponent, RenderPosition.BEFOREEND);
    };

    filmCardComponent.setFilmDetailsClickHandler(() => {
      onElementInteract();
    });

    render(filmListElement, filmCardComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const nextFilmCount = this._renderedFilmsCount + FilmCardCount.DEFAULT;
    const appendFilms = this._allFilms.slice(this._renderedFilmsCount, nextFilmCount);

    appendFilms.forEach((film) => this._renderFilmCard(this._allFilmsComponent.getFilmsContainer(), film));

    this._renderedFilmsCount += appendFilms.length;

    if (this._renderedFilmsCount >= this._allFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._allFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
