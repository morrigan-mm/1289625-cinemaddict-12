import FilmsListView from "../view/films-list.js";
import AllFilmsView from "../view/all-films.js";
import NoFilmsView from "../view/no-films.js";
import TopRatedFilmsView from "../view/top-rated-films.js";
import MostCommentedFilmsView from "../view/most-commented-films.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import SortingView from "../view/sorting.js";

import FilmCardPopupPresenter from "./film-card-popup.js";

import {FilmCardCount, SortType, UserAction} from "../constants.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortBy, update} from "../utils/common.js";

export default class FilmList {
  constructor(filmListContainer, filmsModel) {
    this._container = filmListContainer;
    this._filmsModel = filmsModel;

    this._filmCards = {};
    // this._allFilms = [];
    this._renderedFilmsCount = FilmCardCount.DEFAULT;
    this._sortType = SortType.DEFAULT;

    this._sortingComponent = new SortingView(this._sortType);
    this._filmListComponent = new FilmsListView();
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedFilmsComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._noFilmsComponent = new NoFilmsView();

    this._updateFilm = this._updateFilm.bind(this);
    this._handleFilmsModelChange = this._handleFilmsModelChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleFilmsModelChange);
  }

  _getFilms() {
    switch (this._sortType) {
      case SortType.DATE:
        return sortBy(this._filmsModel.getFilms(), (film) => film.releaseDate);
      case SortType.RATING:
        return sortBy(this._filmsModel.getFilms(), (film) => film.rating);
      default:
        return this._filmsModel.getFilms().slice();
    }
  }

  render() {
    this._renderSorting();

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderContent();
  }

  _updateFilm(updated) {
    throw new Error(`Not implemented: updateFilm`, updated);
  }

  _handleFilmsModelChange(film) {
    const filmCardViews = this._filmCards[film.id];

    filmCardViews.forEach((smartView) => smartView.updateData(film));

    if (this._filmCardPopup && this._filmCardPopup.isOpen()) {
      this._filmCardPopup.updateData(film);
    }
  }

  _handleSortTypeChange(sortType) {
    this._sortType = sortType;

    this._clearAllFilms();
    this._renderAllFilms();
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContent() {
    const films = this._getFilms();

    if (!films.length) {
      this._renderNoFilms();

      return;
    }

    this._renderAllFilms();

    const areRatedFilms = films.some((film) => film.rating !== 0);
    const areCommentedFilms = films.some((film) => film.comments.length !== 0);

    if (areRatedFilms) {
      this._renderTopRatedFilms();
    }

    if (areCommentedFilms) {
      this._renderMostCommentedFilms();
    }
  }

  _renderNoFilms() {
    render(this._filmListComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _clearAllFilms() {
    remove(this._allFilmsComponent);

    this._renderedFilmsCount = FilmCardCount.DEFAULT;
  }

  _renderAllFilms() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FilmCardCount.DEFAULT));

    this._renderFilms(this._allFilmsComponent.getFilmsContainer(), films);

    if (this._renderedFilmsCount < filmsCount) {
      this._renderShowMoreButton();
    }

    render(this._filmListComponent, this._allFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTopRatedFilms() {
    const films = sortBy(this._filmsModel.getFilms(), (film) => film.rating).slice(0, FilmCardCount.EXTRA);

    this._renderFilms(this._topRatedFilmsComponent.getFilmsContainer(), films);

    render(this._filmListComponent, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilms() {
    const films = sortBy(this._filmsModel.getFilms(), (film) => film.comments.length).slice(0, FilmCardCount.EXTRA);

    this._renderFilms(this._mostCommentedFilmsComponent.getFilmsContainer(), films);

    render(this._filmListComponent, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilms(container, films) {
    films.forEach((film) => this._renderFilmCard(container, film));
  }

  _renderFilmCard(filmListElement, film) {
    const filmCardComponent = new FilmCardView(film);

    const onElementInteract = () => {
      const currentFilm = this._filmsModel.getFilm(film.id);

      if (this._filmCardPopup && this._filmCardPopup.isOpen()) {
        this._filmCardPopup.close();
      }

      this._filmCardPopup = new FilmCardPopupPresenter(currentFilm);

      this._filmCardPopup.setWatchListChangeHandler(() => {
        onUserAction(UserAction.TOGGLE_WATCHLIST);
      });

      this._filmCardPopup.setWatchedChangeHandler(() => {
        onUserAction(UserAction.TOGGLE_WATCHED);
      });

      this._filmCardPopup.setFavoriteChangeHandler(() => {
        onUserAction(UserAction.TOGGLE_FAVORITE);
      });

      this._filmCardPopup.render();
    };

    const onUserAction = (userAction) => {
      const currentFilm = this._filmsModel.getFilm(film.id);

      let newFilm;

      switch (userAction) {
        case UserAction.TOGGLE_FAVORITE:
          newFilm = update(currentFilm, {isFavorite: !currentFilm.isFavorite});
          break;
        case UserAction.TOGGLE_WATCHED:
          newFilm = update(currentFilm, {isWatched: !currentFilm.isWatched});
          break;
        case UserAction.TOGGLE_WATCHLIST:
          newFilm = update(currentFilm, {isAddedToWatchList: !currentFilm.isAddedToWatchList});
          break;
      }

      if (newFilm) {
        this._filmsModel.updateFilm(newFilm);
      }
    };

    filmCardComponent.setWatchListClickHandler(() => {
      onUserAction(UserAction.TOGGLE_WATCHLIST);
    });

    filmCardComponent.setWatchedClickHandler(() => {
      onUserAction(UserAction.TOGGLE_WATCHED);
    });

    filmCardComponent.setFavoriteClickHandler(() => {
      onUserAction(UserAction.TOGGLE_FAVORITE);
    });

    filmCardComponent.setFilmDetailsClickHandler(() => {
      onElementInteract();
    });

    this._filmCards[film.id] = this._filmCards[film.id] || [];
    this._filmCards[film.id].push(filmCardComponent);

    render(filmListElement, filmCardComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FilmCardCount.DEFAULT);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(this._allFilmsComponent.getFilmsContainer(), films);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._allFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
