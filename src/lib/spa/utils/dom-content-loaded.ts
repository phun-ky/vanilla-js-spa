import { NavigateToEvent, EventType } from '../types';

import { router } from '../router';
import { bootstrap } from './bootstrap';
import { eventMatches } from './event-matches';
import { navigateTo } from './navigate-to';

// When DOM is loaded
export const DOMContentLoaded = async () => {
  // If any navigation is fired through a custom event
  document.addEventListener('navigateTo', (e: NavigateToEvent) => {
    const { to } = e.detail;

    navigateTo(to);
  });
  // If a user clicks a link that should change the popstate, instead of hard routing
  document.body.addEventListener(
    'click',
    async (e: EventType<HTMLElement>) => {
      const el = eventMatches(e, '[data-link]') as HTMLAnchorElement;

      if (el) {
        e.preventDefault();
        await navigateTo(el.href);
      }
    }
  );

  // Get current route
  const routeDetails = router();

  // Reinitialisze the SPA
  await bootstrap(routeDetails);

};
