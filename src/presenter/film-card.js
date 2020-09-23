import FilmCardView from "../view/film-card.js";
import {render, RenderPosition} from "../utils/render.js";
import {UserAction} from "../constants.js";

export default class FilmCard {
  constructor(container, film, userActionHandler) {
    this._film = film;
    this._container = container;

    const view = new FilmCardView(film);

    this._filmCardComponent = view;
    this._userActionHandler = userActionHandler;

    this.updateData = view.updateData.bind(view);

    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._watchListChangeHandler = this._watchListChangeHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
  }

  render() {
    this._filmCardComponent.setCardClickHandler(this._cardClickHandler);
    this._filmCardComponent.setWatchListClickHandler(this._watchListChangeHandler);
    this._filmCardComponent.setWatchedClickHandler(this._watchedChangeHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._favoriteChangeHandler);

    render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _cardClickHandler() {
    this._userActionHandler(UserAction.CLICK_CARD, this._film);
  }

  _watchListChangeHandler() {
    this._userActionHandler(UserAction.TOGGLE_WATCHLIST, this._film);
  }

  _watchedChangeHandler() {
    this._userActionHandler(UserAction.TOGGLE_WATCHED, this._film);
  }

  _favoriteChangeHandler() {
    this._userActionHandler(UserAction.TOGGLE_FAVORITE, this._film);
  }
}
