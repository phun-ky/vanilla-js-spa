import { getParams } from '../utils/get-params';

import { Route, RouterMatch } from '../types';

import { getRouterMatch } from './utils/get-router-match';

import { routes } from './routes';

let previousPage: RouterMatch = {
  route: { name: 'none' }
};
let previousParams = {};

export const router = () => {
  const page: RouterMatch = getRouterMatch(routes);
  const currentParams = getParams(page);

  let paramsChanged = false;
  let routeChanged = false;

  if (previousPage.route.name === (page.route as Route).name) {
    if (JSON.stringify(previousParams) !== JSON.stringify(currentParams)) {
      paramsChanged = true;
      routeChanged = true;
      window.scrollTo(0, 0);
      document.dispatchEvent(
        new CustomEvent('eventParamsChanged', {
          bubbles: true,
          cancelable: true,
          detail: {
            previousParams,
            currentParams
          }
        })
      );
    }
  } else {
    routeChanged = true;
    window.scrollTo(0, 0);
  }

  previousParams = getParams(page);
  previousPage = page as RouterMatch;

  const routeDetails = {
    page,
    previousPage,
    previousParams,
    currentParams,
    paramsChanged,
    routeChanged
  };

  if (routeChanged) {
    document.dispatchEvent(
      new CustomEvent('eventBeforeRouteChanged', {
        bubbles: true,
        cancelable: true,
        detail: {
          routeDetails
        }
      })
    );
  }

  return routeDetails;
};
