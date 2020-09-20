import SmartView from "./smart.js";
import {PageType} from "../constants.js";

const ACTIVE_ITEM_CLASSNAME = `main-navigation__item--active`;
const ACTIVE_STATS_CLASSNAME = `main-navigation__additional--active`;

const createFilterItemTemplate = (filter, active) => {
  const {type, name, count} = filter;
  const classNames = active
    ? `main-navigation__item ${ACTIVE_ITEM_CLASSNAME}`
    : `main-navigation__item`;

  const filterCount = count !== undefined ? `<span class="main-navigation__item-count">${count}</span>` : ``;

  return `<a href="#${type}" class="${classNames}">${name} ${filterCount}</a>`;
};

const createMainNavigationTemplate = (filterItems, currentFilter, page) => {
  const isStatsPage = page === PageType.STATISTICS;

  const statsClassNames = isStatsPage
    ? `main-navigation__additional ${ACTIVE_STATS_CLASSNAME}`
    : `main-navigation__additional`;

  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, !isStatsPage && filter.type === currentFilter))
    .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="${statsClassNames}">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends SmartView {
  constructor({filters, currentFilter, page}) {
    super();

    this._data = {
      filters,
      currentFilter,
      page
    };

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatisticsShow = this._handleStatisticsShow.bind(this);
  }

  getTemplate() {
    const {filters, currentFilter, page} = this._data;
    return createMainNavigationTemplate(filters, currentFilter, page);
  }

  restoreHandlers() {
    const {changeFilterType, showStatistics} = this._callback;

    if (changeFilterType) {
      this.setFilterTypeChangeHandler(changeFilterType);
    }

    if (showStatistics) {
      this.setStatisticsShowHandler(showStatistics);
    }
  }

  _handleFilterTypeChange(evt) {
    evt.preventDefault();

    const target = evt.target.closest(`a`);
    const type = target.getAttribute(`href`).replace(`#`, ``);

    this._callback.changeFilterType(type);
  }

  _handleStatisticsShow(evt) {
    evt.preventDefault();

    this._callback.showStatistics();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.changeFilterType = callback;
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._handleFilterTypeChange);
  }

  setStatisticsShowHandler(callback) {
    this._callback.showStatistics = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._handleStatisticsShow);
  }
}
