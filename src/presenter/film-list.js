import FilmsListView from "../view/films-list.js";
import AllFilmsView from "../view/all-films.js";
import NoFilmsView from "../view/no-films.js";
import TopRatedFilmsView from "../view/top-rated-films.js";
import MostCommentedFilmsView from "../view/most-commented-films.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import SortingView from "../view/sorting.js";
import FilmCardPresenter from "./film-card.js";
import FilmCardPopupPresenter from "./film-card-popup.js";
import {FilmCardCount, SortType, UserAction} from "../constants.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortBy, update} from "../utils/common.js";

export default class FilmList {
  constructor(filmListContainer, filmsModel) {
    this._container = filmListContainer;
    this._filmsModel = filmsModel;

    this._filmCards = {};

    this._renderedFilmsCount = FilmCardCount.DEFAULT;
    this._sortType = SortType.DEFAULT;

    this._sortingComponent = new SortingView(this._sortType);
    this._filmListComponent = new FilmsListView();
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedFilmsComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleUserAction = this._handleUserAction.bind(this);
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

  _updateFilm(filmId, getUpdate) {
    const currentFilm = this._filmsModel.getFilm(filmId);
    const newFilm = update(currentFilm, getUpdate(currentFilm));
    this._filmsModel.updateFilm(newFilm);
  }

  _handleFilmsModelChange(film) {
    const filmCards = this._filmCards[film.id];

    filmCards.forEach((filmCard) => filmCard.updateData(film));

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

    const hasFilmsRating = films.some((film) => film.rating !== 0);
    const hasFilmsComments = films.some((film) => film.comments.length !== 0);

    if (hasFilmsRating) {
      this._renderTopRatedFilms();
    }

    if (hasFilmsComments) {
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

  _handleUserAction(userAction, payload) {
    switch (userAction) {
      case UserAction.CLICK_CARD:
        this._renderPopup(payload.id);
        break;
      case UserAction.TOGGLE_FAVORITE:
        this._updateFilm(payload.id, ({isFavorite}) => ({isFavorite: !isFavorite}));
        break;
      case UserAction.TOGGLE_WATCHED:
        this._updateFilm(payload.id, ({isWatched}) => ({isWatched: !isWatched}));
        break;
      case UserAction.TOGGLE_WATCHLIST:
        this._updateFilm(payload.id, ({isAddedToWatchList}) => ({isAddedToWatchList: !isAddedToWatchList}));
        break;
    }
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

  _renderPopup(filmId) {
    const currentFilm = this._filmsModel.getFilm(filmId);

    if (this._filmCardPopup && this._filmCardPopup.isOpen()) {
      this._filmCardPopup.close();
    }

    this._filmCardPopup = new FilmCardPopupPresenter(currentFilm, this._handleUserAction);

    this._filmCardPopup.render();
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
    const filmCard = new FilmCardPresenter(filmListElement, film, this._handleUserAction);

    filmCard.render();

    this._filmCards[film.id] = this._filmCards[film.id] || [];
    this._filmCards[film.id].push(filmCard);
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
