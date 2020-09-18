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

    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatisticsShow = this._handleStatisticsShow.bind(this);
  }

  render() {
    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();
    const page = this._pageModel.getPage();

    this._mainNavigationComponent = new MainNavigationView({filters, currentFilter, page});
    render(this._container, this._mainNavigationComponent, RenderPosition.AFTERBEGIN);

    this._mainNavigationComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._mainNavigationComponent.setStatisticsShowHandler(this._handleStatisticsShow);

    this._pageModel.addObserver(this._handleModelUpdate);
    this._filmsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);
  }

  _handleModelUpdate() {
    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();
    const page = this._pageModel.getPage();

    this._mainNavigationComponent.updateData({filters, currentFilter, page});
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() !== filterType) {
      this._filterModel.setFilter(filterType);
    }

    if (this._pageModel.getPage() === PageType.STATISTICS) {
      this._pageModel.setPage(PageType.FILM_LIST);
    }
  }

  _handleStatisticsShow() {
    if (this._pageModel.getPage() === PageType.FILM_LIST) {
      this._pageModel.setPage(PageType.STATISTICS);
    }
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
