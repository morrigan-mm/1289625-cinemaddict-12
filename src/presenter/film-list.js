import FilmsListView from "../view/films-list.js";
import AllFilmsView from "../view/all-films.js";
import NoFilmsView from "../view/no-films.js";
import TopRatedFilmsView from "../view/top-rated-films.js";
import MostCommentedFilmsView from "../view/most-commented-films.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmCardPopupView from "../view/film-card-popup.js";

import {FilmCardCount} from "../constants.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortBy} from "../utils/common.js";
import {isEscKey} from "../utils/keyboard.js";

export default class FilmList {
  constructor(filmListContainer) {
    this._container = filmListContainer;
    this._renderedFilmCount = FilmCardCount.DEFAULT;

    this._filmListComponent = new FilmsListView();
    this._allFilmsComponent = new AllFilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._topRatedFilmsComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films;

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderContent();
  }

  _renderContent() {
    if (!this._films.length) {
      this._renderNoFilms();
      return;
    }

    const topRatedFilms = sortBy(this._films, (film) => film.rating);
    const mostCommentedFilms = sortBy(this._films, (film) => film.comments.length);
    const primaryFilms = this._films.length > FilmCardCount.DEFAULT
      ? this._films.slice(0, FilmCardCount.DEFAULT)
      : this._films;

    this._renderAllFilms(primaryFilms);
    this._renderTopRatedFilms(topRatedFilms);
    this._renderMostCommentedFilms(mostCommentedFilms);
  }

  _renderNoFilms() {
    render(this._filmListComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderAllFilms(filmList) {
    filmList.forEach((film) => this._renderFilmCard(this._allFilmsComponent.getFilmsContainer(), film));

    if (this._films.length > FilmCardCount.DEFAULT) {
      this._renderShowMoreButton();
    }

    render(this._filmListComponent, this._allFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderTopRatedFilms(filmList) {
    filmList.slice(0, FilmCardCount.EXTRA)
      .forEach((film) => this._renderFilmCard(this._topRatedFilmsComponent.getFilmsContainer(), film));

    render(this._filmListComponent, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilms(filmList) {
    filmList.slice(0, FilmCardCount.EXTRA)
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
    const nextFilmCount = this._renderedFilmCount + FilmCardCount.DEFAULT;
    const appendFilms = this._films.slice(this._renderedFilmCount, nextFilmCount);

    appendFilms.forEach((film) => this._renderFilmCard(this._allFilmsComponent.getFilmsContainer(), film));

    this._renderedFilmCount = nextFilmCount;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._allFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
