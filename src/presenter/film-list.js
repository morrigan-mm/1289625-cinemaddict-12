import CommentsModel from "../model/comments.js";
import FilmsListView from "../view/films-list.js";
import FilmsListExtraView from "../view/films-list-extra.js";
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
    this._topRatedFilmsComponent = new FilmsListExtraView(`Top rated`);
    this._mostCommentedFilmsComponent = new FilmsListExtraView(`Most commented`);
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._loadingComponent = new LoadingView();
    this._noFilmsComponent = new NoFilmsView();

    this._userActionHandler = this._userActionHandler.bind(this);
    this._commentsModelChangeHandler = this._commentsModelChangeHandler.bind(this);
    this._filmsModelChangeHandler = this._filmsModelChangeHandler.bind(this);
    this._filterModelChangeHandler = this._filterModelChangeHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    this._filmsModel.addObserver(this._filmsModelChangeHandler);
  }

  destroy() {
    remove(this._sortingComponent);
    remove(this._filmListComponent);

    this._filmsModel.removeObserver(this._filmsModelChangeHandler);
    this._filterModel.removeObserver(this._filterModelChangeHandler);

    if (this._commentsModel) {
      this._commentsModel.removeObserver(this._commentsModelChangeHandler);
    }
  }

  render() {
    this._renderSorting();

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);

    if (this._filmsModel.getLoading()) {
      this._renderLoading();
    } else {
      this._renderContent();
    }
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);

    this._sortingComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
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

    this._filterModel.addObserver(this._filterModelChangeHandler);
  }

  _renderLoading() {
    render(this._filmListComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    render(this._filmListComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
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
      this._commentsModel.removeObserver(this._commentsModelChangeHandler);
      this._commentsModel = null;
    }

    if (this._filmCardPopup && this._filmCardPopup.isOpen()) {
      this._filmCardPopup.close();
    }

    this._commentsModel = new CommentsModel(filmId);
    this._commentsModel.addObserver(this._commentsModelChangeHandler);

    this._api.getComments(filmId)
      .then((comments) => this._commentsModel.setComments(comments));

    this._filmCardPopup = new FilmCardPopupPresenter(currentFilm, this._commentsModel, this._userActionHandler);
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
    const filmCard = new FilmCardPresenter(filmListElement, film, this._userActionHandler);

    filmCard.render();

    this._filmCards[film.id] = this._filmCards[film.id] || [];
    this._filmCards[film.id].push(filmCard);
  }

  _renderShowMoreButton() {
    render(this._allFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
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

  _clearAllFilms() {
    remove(this._allFilmsComponent);

    this._renderedFilmsCount = FilmCardCount.DEFAULT;
  }

  _filmsModelChangeHandler(film) {
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

  _commentsModelChangeHandler(filmId) {
    const comments = this._commentsModel.getComments();
    const commentIds = comments.map((comment) => comment.id);

    this._updateFilm(filmId, () => ({comments: commentIds}));
  }

  _filterModelChangeHandler() {
    this._sortingComponent.setSortType(SortType.DEFAULT);
    this._updateAllFilms();
  }

  _sortTypeChangeHandler(sortType) {
    this._sortType = sortType;
    this._updateAllFilms();
  }

  _userActionHandler(userAction, payload) {
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
        const film = this._createFilmUpdate(payload.id, ({isWatched}) => ({
          isWatched: !isWatched,
          watchingDate: !isWatched ? new Date().toISOString() : null,
        }));
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

  _showMoreButtonClickHandler() {
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
}
