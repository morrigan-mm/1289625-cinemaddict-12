import SmartView from "./smart.js";

const createFooterStatisticsTemplate = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class FooterStatistics extends SmartView {
  constructor({count}) {
    super();

    this._data = {count};
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._data.count);
  }

  restoreHandlers() {}
}
