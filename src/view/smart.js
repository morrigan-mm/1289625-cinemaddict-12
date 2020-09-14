import {update} from "../utils/common.js";
import {replace} from "../utils/render.js";
import Abstract from "./abstract.js";

export default class Smart extends Abstract {
  constructor() {
    super();

    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateData(upd) {
    if (!upd) {
      return;
    }

    this._data = update(this._data, upd);

    this.updateElement();
  }

  updateElement() {
    const currentElement = this.getElement();

    this.removeElement();

    replace(this.getElement(), currentElement);

    this.restoreHandlers();
  }
}
