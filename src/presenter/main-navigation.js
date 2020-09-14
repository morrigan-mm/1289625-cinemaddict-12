import MainNavigationView from "../view/main-navigation.js";
import {filter} from "../utils/filter.js";
import {FilterType} from "../constants.js";
import {render, RenderPosition} from "../utils/render.js";

export default class MainNavigation {
  constructor(container, filterModel, filmsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._mainNavigationComponent = null;

    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  render() {
    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();

    this._mainNavigationComponent = new MainNavigationView({filters, currentFilter});
    render(this._container, this._mainNavigationComponent, RenderPosition.AFTERBEGIN);

    this._mainNavigationComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    this._filmsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);
  }

  _handleModelUpdate() {
    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();

    this._mainNavigationComponent.updateData({filters, currentFilter});
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](films).length
      }
    ];
  }
}
