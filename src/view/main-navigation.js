import SmartView from "./smart.js";

const ACTIVE_ITEM_CLASSNAME = `main-navigation__item--active`;

const createFilterItemTemplate = (filter, active) => {
  const {type, name, count} = filter;
  const classNames = active
    ? `main-navigation__item ${ACTIVE_ITEM_CLASSNAME}`
    : `main-navigation__item`;

  const filterCount = count !== undefined ? `<span class="main-navigation__item-count">${count}</span>` : ``;

  return `<a href="#${type}" class="${classNames}">${name} ${filterCount}</a>`;
};

const createMainNavigationTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, filter.type === currentFilter))
    .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends SmartView {
  constructor({filters, currentFilter}) {
    super();

    this._data = {
      filters,
      currentFilter
    };

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  getTemplate() {
    const {filters, currentFilter} = this._data;
    return createMainNavigationTemplate(filters, currentFilter);
  }

  restoreHandlers() {
    const {changeFilterType} = this._callback;

    if (changeFilterType) {
      this.setFilterTypeChangeHandler(changeFilterType);
    }
  }

  _handleFilterTypeChange(evt) {
    evt.preventDefault();

    const target = evt.target.closest(`a`);
    const type = target.getAttribute(`href`).replace(`#`, ``);

    this._callback.changeFilterType(type);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.changeFilterType = callback;
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._handleFilterTypeChange);
  }
}
