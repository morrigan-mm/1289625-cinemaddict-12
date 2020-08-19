import {createElement} from "../utils.js";

const createContainerTemplate = () => {
  return `<section class="films"></section>`;
};

export default class Container {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
