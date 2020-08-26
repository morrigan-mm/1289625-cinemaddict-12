import AbstractView from "./abstract.js";

const createFooterStatisticsTemplate = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class createFooterStatistics extends AbstractView {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }
}
