import AbstractView from "./abstract.js";
import {capitalize} from "../utils/common.js";
import {FilterTitle} from "../constants.js";

const createFilterItemTemplate = (filter, active) => {
  const {title, count} = filter;
  const classNames = active
    ? `main-navigation__item main-navigation__item--active`
    : `main-navigation__item`;

  if (title === FilterTitle.ALL) {
    return `<a href="#${title}" class="${classNames}">All movies</a>`;
  }
  return ` <a href="#${title}" class="${classNames}">${capitalize(title)} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createMainNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
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

export default class MainNavigation extends AbstractView {
  constructor(filterItems) {
    super();

    this._filterItems = filterItems;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filterItems);
  }
}
