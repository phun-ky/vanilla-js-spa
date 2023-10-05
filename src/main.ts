// Global events
import { DOMContentLoaded } from './lib/spa/utils/dom-content-loaded';
import { eventAfterAppRender } from './lib/spa/utils/event-after-app-render';
import { popstate } from './lib/spa/utils/popstate';

// Styles
import './styles/index.styl';

// Events that happens on URL change in our SPA
window.addEventListener('popstate', popstate);
// Events that happens after DOM is loaded
document.addEventListener('DOMContentLoaded', DOMContentLoaded);
// Events that happens after eveyr App render
document.addEventListener('eventAfterAppRender', eventAfterAppRender);
