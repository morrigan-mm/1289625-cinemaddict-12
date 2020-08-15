import {capitalize} from "../utils.js";

const createFilterItemTemplate = (filter, active) => {
  const {title, count} = filter;
  const classNames = active
    ? `main-navigation__item main-navigation__item--active`
    : `main-navigation__item`;

  if (title === `all`) {
    return `<a href="#${title}" class="${classNames}">All movies</a>`;
  }
  return ` <a href="#${title}" class="${classNames}">${capitalize(title)} <span class="main-navigation__item-count">${count}</span></a>`;
};

export const createMainNavigationTemplate = (filterItems) => {
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
