import SmartView from "./smart.js";

const createHeaderProfileTemplate = ({rank}) => {
  const caption = rank ? `<p class="profile__rating">${rank}</p>` : ``;

  return (
    `<section class="header__profile profile">
      ${caption}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class HeaderProfile extends SmartView {
  constructor({rank}) {
    super();

    this._data = {rank};
  }

  restoreHandlers() {}

  getTemplate() {
    return createHeaderProfileTemplate(this._data);
  }
}
