import CommentsModel from "../model/comments.js";
import FilmsListView from "../view/films-list.js";
import FilmListExtraView from "../view/film-list-extra.js";
import AllFilmsView from "../view/all-films.js";
import NoFilmsView from "../view/no-films.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import SortingView from "../view/sorting.js";
import LoadingView from "../view/loading.js";
import FilmCardPresenter from "./film-card.js";
import FilmCardPopupPresenter from "./film-card-popup.js";
import {FilterType, FilmCardCount, SortType, UserAction} from "../constants.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortBy, update} from "../utils/common.js";
import {filter} from "../utils/filter.js";

export default class FilmList {
  constructor(api, filmListContainer, filterModel, filmsModel) {
    this._api = api;
    this._container = filmListContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filmCards = {};

    this._renderedFilmsCount = FilmCardCount.DEFAULT;
    this._sortType = SortType.DEFAULT;

    this._sortingComponent = new SortingView(this._sortType);
    this._filmListComponent = new FilmsListView();
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedFilmsComponent = new FilmListExtraView(`Top rated`);
    this._mostCommentedFilmsComponent = new FilmListExtraView(`Most commented`);
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._loadingComponent = new LoadingView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleUserAction = this._handleUserAction.bind(this);
    this._handleCommentsModelChange = this._handleCommentsModelChange.bind(this);
    this._handleFilmsModelChange = this._handleFilmsModelChange.bind(this);
    this._handleFilterModelChange = this._handleFilterModelChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleFilmsModelChange);
  }

  _getAllFilms() {
    const currentFilter = this._filterModel.getFilter();
    const films = filter[currentFilter](this._filmsModel.getFilms());

    switch (this._sortType) {
      case SortType.DATE: {
        return sortBy(films, (film) => new Date(film.releaseDate));
      }
      case SortType.RATING: {
        return sortBy(films, (film) => film.rating);
      }
      default: {
        return films.slice();
      }
    }
  }

  render() {
    this._renderSorting();

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderLoading();
  }

  _updateAllFilms() {
    this._clearAllFilms();
    this._renderAllFilms();
  }

  _createFilmUpdate(filmId, getUpdate) {
    const currentFilm = this._filmsModel.getFilm(filmId);
    return update(currentFilm, getUpdate(currentFilm));
  }

  _updateFilm(filmId, getUpdate) {
    const newFilm = this._createFilmUpdate(filmId, getUpdate);
    this._filmsModel.updateFilm(newFilm);
  }

  _handleFilmsModelChange(film) {
    if (Array.isArray(film)) {
      this._renderContent();
      return;
    }

    const filmCards = this._filmCards[film.id];

    filmCards.forEach((filmCard) => filmCard.updateData(film));

    if (this._filmCardPopup && this._filmCardPopup.isOpen()) {
      const comments = this._commentsModel.getComments();
      this._filmCardPopup.updateData({comments, film});
    }
  }

  _handleCommentsModelChange(filmId) {
    const comments = this._commentsModel.getComments();
    const commentIds = comments.map((comment) => comment.id);

    this._updateFilm(filmId, () => ({comments: commentIds}));
  }

  _handleFilterModelChange() {
    this._sortingComponent.setSortType(SortType.DEFAULT);
    this._updateAllFilms();
  }

  _handleSortTypeChange(sortType) {
    this._sortType = sortType;
    this._updateAllFilms();
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);

    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContent() {
    remove(this._loadingComponent);

    const films = this._filmsModel.getFilms();

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

    this._filterModel.addObserver(this._handleFilterModelChange);
  }

  _renderLoading() {
    render(this._filmListComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    render(this._filmListComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _clearAllFilms() {
    remove(this._allFilmsComponent);

    this._renderedFilmsCount = FilmCardCount.DEFAULT;
  }

  _handleUserAction(userAction, payload) {
    const currentFilter = this._filterModel.getFilter();

    switch (userAction) {
      case UserAction.ADD_COMMENT: {
        this._api.addComment(payload.filmId, payload.localComment)
          .then((comments) => this._commentsModel.setComments(comments))
          .then(() => this._renderMostCommentedFilms())
          .catch(() => this._filmCardPopup.shakeForm());
        break;
      }
      case UserAction.DELETE_COMMENT: {
        this._api.deleteComment(payload)
          .then(() => this._commentsModel.deleteComment(payload))
          .then(() => this._renderMostCommentedFilms())
          .catch(() => this._commentsModel.setComments(this._commentsModel.getComments()));
        break;
      }
      case UserAction.CLICK_CARD: {
        this._renderPopup(payload.id);
        break;
      }
      case UserAction.TOGGLE_FAVORITE: {
        const film = this._createFilmUpdate(payload.id, ({isFavorite}) => ({isFavorite: !isFavorite}));
        this._api.updateFilm(film)
          .then((updated) => {
            this._filmsModel.updateFilm(updated);
            if (currentFilter === FilterType.FAVORITES) {
              this._updateAllFilms();
            }
          })
          .catch(() => this._filmsModel.updateFilm(this._filmsModel.getFilm(payload.id)));
        break;
      }
      case UserAction.TOGGLE_WATCHED: {
        const film = this._createFilmUpdate(payload.id, ({isWatched}) => ({isWatched: !isWatched}));
        this._api.updateFilm(film)
          .then((updated) => {
            this._filmsModel.updateFilm(updated);
            if (currentFilter === FilterType.HISTORY) {
              this._updateAllFilms();
            }
          })
          .catch(() => this._filmsModel.updateFilm(this._filmsModel.getFilm(payload.id)));
        break;
      }
      case UserAction.TOGGLE_WATCHLIST: {
        const film = this._createFilmUpdate(payload.id, ({isAddedToWatchList}) => ({isAddedToWatchList: !isAddedToWatchList}));
        this._api.updateFilm(film)
          .then((updated) => {
            this._filmsModel.updateFilm(updated);
            if (currentFilter === FilterType.WATCHLIST) {
              this._updateAllFilms();
            }
          })
          .catch(() => this._filmsModel.updateFilm(this._filmsModel.getFilm(payload.id)));
        break;
      }
    }
  }

  _renderAllFilms() {
    const allFilms = this._getAllFilms();

    const filmsCount = allFilms.length;
    const films = allFilms.slice(0, Math.min(filmsCount, FilmCardCount.DEFAULT));

    this._renderFilms(this._allFilmsComponent.getFilmsContainer(), films);

    if (this._renderedFilmsCount < filmsCount) {
      this._renderShowMoreButton();
    }

    render(this._filmListComponent, this._allFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPopup(filmId) {
    const currentFilm = this._filmsModel.getFilm(filmId);

    if (this._commentsModel) {
      this._commentsModel.removeObserver(this._handleCommentsModelChange);
      this._commentsModel = null;
    }

    if (this._filmCardPopup && this._filmCardPopup.isOpen()) {
      this._filmCardPopup.close();
    }

    this._commentsModel = new CommentsModel(filmId);
    this._commentsModel.addObserver(this._handleCommentsModelChange);

    this._api.getComments(filmId)
      .then((comments) => this._commentsModel.setComments(comments));

    this._filmCardPopup = new FilmCardPopupPresenter(currentFilm, this._commentsModel, this._handleUserAction);
    this._filmCardPopup.render();
  }

  _renderTopRatedFilms() {
    const films = sortBy(this._filmsModel.getFilms(), (film) => film.rating).slice(0, FilmCardCount.EXTRA);

    this._renderFilms(this._topRatedFilmsComponent.getFilmsContainer(), films);

    render(this._filmListComponent, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilms() {
    const films = sortBy(this._filmsModel.getFilms(), (film) => film.comments.length).slice(0, FilmCardCount.EXTRA);

    remove(this._mostCommentedFilmsComponent);

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
    const allFilms = this._getAllFilms();
    const filmsCount = allFilms.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FilmCardCount.DEFAULT);
    const films = allFilms.slice(this._renderedFilmsCount, newRenderedFilmsCount);

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
