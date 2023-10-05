import App from '../../../app';

import { RouteDetails } from '../types';
import { init } from '../';

export const bootstrap = async (routeDetails: RouteDetails) => {
  await init(App, routeDetails);
};
