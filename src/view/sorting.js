import AbstractView from "./abstract.js";
import {SortType} from "../constants.js";

const ACTIVE_BUTTON_CLASSNAME = `sort__button--active`;

const createSortingButtonTemplate = (type, active) => {
  const buttonClassnames = active ? `sort__button ${ACTIVE_BUTTON_CLASSNAME}` : `sort__button`;

  return `<a href="#" class="${buttonClassnames}" data-sort-type="${type}">Sort by ${type}</a>`;
};

const createSortingTemplate = (activeSortType) => {
  return (
    `<ul class="sort">
      <li>${createSortingButtonTemplate(SortType.DEFAULT, SortType.DEFAULT === activeSortType)}</li>
      <li>${createSortingButtonTemplate(SortType.DATE, SortType.DATE === activeSortType)}</li>
      <li>${createSortingButtonTemplate(SortType.RATING, SortType.RATING === activeSortType)}</li>
    </ul>`
  );
};

export default class Sorting extends AbstractView {
  constructor(initialSortType) {
    super();

    this._initialSortType = initialSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._initialSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();

    const nextSortType = evt.target.dataset.sortType;

    this.setSortType(nextSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  setSortType(sortType) {
    const currentActive = this.getElement().querySelector(`.${ACTIVE_BUTTON_CLASSNAME}`);
    const nextActive = this.getElement().querySelector(`[data-sort-type="${sortType}"]`);

    if (currentActive === nextActive) {
      return;
    }

    if (currentActive) {
      currentActive.classList.remove(ACTIVE_BUTTON_CLASSNAME);
    }

    if (nextActive) {
      nextActive.classList.add(ACTIVE_BUTTON_CLASSNAME);
    }

    this._callback.sortTypeChange(sortType);
  }
}
