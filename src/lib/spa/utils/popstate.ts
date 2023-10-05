import { router } from '../router';
import { bootstrap } from './bootstrap';

export const popstate = async () => {
  const routeDetails = router();

  await bootstrap(routeDetails);
};
