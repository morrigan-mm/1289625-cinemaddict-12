import {createHeaderProfileTemplate} from "./view/header-profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createContainerTemplate} from "./view/container.js";
import {createContentLayoutTemplate} from "./view/content-layout.js";
import {createFooterStatisticsTemplate} from "./view/footer-statistics.js";
import {createFilmCardPopupTemplate} from "./view/film-card-popup.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, createHeaderProfileTemplate(), `beforeend`);

const main = body.querySelector(`.main`);
render(main, createMainNavigationTemplate(), `beforeend`);
render(main, createSortingTemplate(), `beforeend`);
render(main, createContainerTemplate(), `beforeend`);

const content = main.querySelector(`.films`);

render(content, createContentLayoutTemplate(`All movies. Upcoming`, {button: true, hiddenTitle: true}), `beforeend`);
render(content, createContentLayoutTemplate(`Top rated`, {extra: true}), `beforeend`);
render(content, createContentLayoutTemplate(`Most commented`, {extra: true}), `beforeend`);

const footerStatistics = body.querySelector(`.footer__statistics`);
render(footerStatistics, createFooterStatisticsTemplate(), `beforeend`);

body.classList.add(`hide-overflow`);
render(body, createFilmCardPopupTemplate(), `beforeend`);

