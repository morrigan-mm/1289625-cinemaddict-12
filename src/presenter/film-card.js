import FilmCardView from "../view/film-card.js";
import {render, RenderPosition} from "../utils/render.js";
import {UserAction} from "../constants.js";

export default class FilmCard {
  constructor(container, film, onUserAction) {
    this._film = film;
    this._container = container;

    const view = new FilmCardView(film);

    this._filmCardComponent = view;
    this._onUserAction = onUserAction;

    this.updateData = view.updateData.bind(view);

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleWatchListChange = this._handleWatchListChange.bind(this);
    this._handleWatchedChange = this._handleWatchedChange.bind(this);
    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
  }

  render() {
    this._filmCardComponent.setCardClickHandler(this._handleCardClick);
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListChange);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedChange);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteChange);

    render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _handleCardClick() {
    this._onUserAction(UserAction.CLICK_CARD, this._film);
  }

  _handleWatchListChange() {
    this._onUserAction(UserAction.TOGGLE_WATCHLIST, this._film);
  }

  _handleWatchedChange() {
    this._onUserAction(UserAction.TOGGLE_WATCHED, this._film);
  }

  _handleFavoriteChange() {
    this._onUserAction(UserAction.TOGGLE_FAVORITE, this._film);
  }
}
