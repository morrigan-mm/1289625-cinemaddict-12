export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItem(key) {
    return this.getItems()[key];
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  setItem(key, value) {
    const store = this.getItems();
    const newItem = Object.assign({}, store, {[key]: value});

    this._storage.setItem(this._storeKey, JSON.stringify(newItem));
  }
}
