import App from '../../../app';

import { init } from '../';
import { router } from '../router';

export const navigateTo = async (url: string) => {
  history.pushState(null, '', url);

  const routeDetails = router();

  await init(App, routeDetails);
};
