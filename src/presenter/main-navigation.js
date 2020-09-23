import MainNavigationView from "../view/main-navigation.js";
import {filter} from "../utils/filter.js";
import {FilterType, PageType} from "../constants.js";
import {render, RenderPosition} from "../utils/render.js";

export default class MainNavigation {
  constructor(container, pageModel, filterModel, filmsModel) {
    this._container = container;
    this._pageModel = pageModel;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._mainNavigationComponent = null;

    this._modelUpdateHandler = this._modelUpdateHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statisticsShowHandler = this._statisticsShowHandler.bind(this);
  }

  render() {
    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();
    const page = this._pageModel.getPage();

    this._mainNavigationComponent = new MainNavigationView({filters, currentFilter, page});
    render(this._container, this._mainNavigationComponent, RenderPosition.AFTERBEGIN);

    this._mainNavigationComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);
    this._mainNavigationComponent.setStatisticsShowHandler(this._statisticsShowHandler);

    this._pageModel.addObserver(this._modelUpdateHandler);
    this._filmsModel.addObserver(this._modelUpdateHandler);
    this._filterModel.addObserver(this._modelUpdateHandler);
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

  _modelUpdateHandler() {
    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();
    const page = this._pageModel.getPage();

    this._mainNavigationComponent.updateData({filters, currentFilter, page});
  }

  _filterTypeChangeHandler(filterType) {
    this._filterModel.setFilter(filterType);

    if (this._pageModel.getPage() === PageType.STATISTICS) {
      this._pageModel.setPage(PageType.FILM_LIST);
    }
  }

  _statisticsShowHandler() {
    this._pageModel.setPage(PageType.STATISTICS);
  }
}
