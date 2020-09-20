import Observer from "../utils/observer.js";
import {PageType} from "../constants.js";

export default class Page extends Observer {
  constructor() {
    super();

    this._pageType = PageType.FILM_LIST;
  }

  setPage(pageType) {
    if (this._pageType !== pageType) {
      this._pageType = pageType;
      this._notify(pageType);
    }
  }

  getPage() {
    return this._pageType;
  }
}
