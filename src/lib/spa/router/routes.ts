import { Route } from '../types';

export const routes: Route[] = [
  { path: '/', page: 'StartPage', name: 'Start', regex: /^\/$/ },
  { path: '/about', page: 'AboutPage', name: 'About', regex: /^\/about$/ }
];
