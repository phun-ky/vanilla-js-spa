/* eslint no-console:0 */
import {
  FunctionType,
  EventArray,
  EventDataAction,
  EventDataId,
  RouteDetails,
  EventType,
  StateContext,
  UseStateValue,
  UseStateReturn
} from './types';

import { waitFor } from './utils/wait-for';
import { setTitle } from './utils/set-title';
import { updateNodes } from './utils/update-nodes';

/**
 * The main functionality that is to be replaced if a framework is to be used
 * instead. The functionality that spa provides, is the same principles and naming that React uses,
 * except for the global event handlers like `addOnClick`.
 */
export const spa = (() => {
  const _root: HTMLElement | null = document.querySelector('#app');

  if (!_root) {
    throw new Error(
      'Missing element for application! Please make sure you have an element with the id of `app` in the DOM'
    );
  }

  const stateHooks: Record<string, StateContext> = {};
  const effectHooks: unknown[] = [];

  let _templateCallback;
  let _page;
  let clickEventArray: EventArray<EventDataId> = [];
  let onRouteChangeEventArray: EventArray<EventDataId> = [];
  let onAfterAppRenderEventArray: EventArray<EventDataId> = [];
  let effectIndex = 0;

  const init = async (
    // eslint-disable-next-line no-unused-vars
    templateCallback: FunctionType,
    routeDetails: RouteDetails
  ) => {
    if (!templateCallback) {
      throw new Error('Missing param `templateCallback` for `init()`');
    }

    if (!routeDetails) {
      throw new Error('Missing param `routeDetails` for `init()`');
    }

    const { page } = routeDetails;

    if (!page) {
      throw new Error('Missing page');
    }

    _templateCallback = templateCallback;
    _page = page;

    await render(routeDetails);
  };
  const render = async (routeDetails?: RouteDetails) => {
    let page = _page;
    let routeChanged = false;

    if (routeDetails) {
      page = routeDetails.page;
      routeChanged = routeDetails.routeChanged;
    }

    console.info(`trying to render "${page?.route?.name}"`);
    clickEventArray = [];
    onRouteChangeEventArray = [];
    onAfterAppRenderEventArray = [];
    // reset state indexes
    Object.keys(stateHooks).forEach(
      (context) => (stateHooks[context].index = 0)
    );

    effectIndex = 0;

    document.dispatchEvent(
      new CustomEvent('eventBeforeAppRender', {
        bubbles: true,
        cancelable: true
      })
    );

    let _html = '';
    let error = false;

    try {
      _html = await _templateCallback(page);
    } catch (e) {
      if (e.message.indexOf('404') !== -1) {
        setTitle('404, page not found');
        _html = `<h1>404, page not found</h1>`;
      } else {
        _html = await _templateCallback('ErrorPage', {
          error: e
        });

        error = true;
        console.error(e);
        console.info(
          `failed to render "${page?.route?.name}", rendering error page`
        );
      }
    }

    updateNodes(_root, _html);

    await waitFor(10);

    document.removeEventListener(
      'eventAfterRouteChanged',
      handleOnRouteChangedListener
    );
    document.addEventListener(
      'eventAfterRouteChanged',
      handleOnRouteChangedListener
    );

    if (routeChanged) {
      document.dispatchEvent(
        new CustomEvent('eventAfterRouteChanged', {
          bubbles: true,
          cancelable: true,
          detail: {
            routeDetails
          }
        })
      );
    }

    const onRender = () => {
      if (
        page &&
        page.route &&
        page.route.page.onRender &&
        typeof page.route.page.onRender === 'function'
      ) {
        page.route.page.onRender();
      }

      document.dispatchEvent(
        new CustomEvent(`eventAfterPage${page.route.name}Render`, {
          bubbles: true,
          cancelable: true
        })
      );

      if (
        _templateCallback &&
        _templateCallback.onRender &&
        typeof _templateCallback.onRender === 'function'
      ) {
        _templateCallback.onRender();
      }

      document.dispatchEvent(
        new CustomEvent('eventAfterAppRender', {
          bubbles: true,
          cancelable: true
        })
      );
    };

    document.removeEventListener(
      'eventAfterAppRender',
      handleAfterAppRenderListeners
    );
    document.addEventListener(
      'eventAfterAppRender',
      handleAfterAppRenderListeners
    );

    onRender();

    document.removeEventListener('click', handleClickListeners);
    document.addEventListener('click', handleClickListeners);
  };
  const handleAfterAppRenderListeners = () => {
    onAfterAppRenderEventArray.forEach((callback: EventDataAction) => {
      callback();
    });
  };
  const handleOnRouteChangedListener = () => {
    onRouteChangeEventArray.forEach((action: EventDataId) =>
      action.callback()
    );
  };
  const handleClickListeners = (e: EventType<HTMLElement>) => {
    clickEventArray.forEach((target: EventDataId) => {
      if (e.target.id === target.id) {
        target.callback(e);
      }
    });
  };
  /**
   * To be able to add event listeners to the "string html" produced by the
   * components, we have to use "global" event handlers.
   * Every usages of this type of function (like `addOnClick`) is to be replaced if
   * a framework is used.
   * @param {string} id The id used for the event
   * @param {Function} callback The callback to use on the event
   */
  // eslint-disable-next-line no-unused-vars
  const addOnClick = (id: string, callback: FunctionType) => {
    clickEventArray.push({ id, callback });
  };
  const addOnRouteChange = (callback: FunctionType) => {
    onRouteChangeEventArray.push(callback);
  };
  const addOnAfterAppRender = (callback: FunctionType) => {
    onAfterAppRenderEventArray.push(callback);
  };
  const useState = (
    initValue: UseStateValue,
    context: string
  ): UseStateReturn => {
    if (!context || typeof context !== 'string' || context === '') {
      throw new Error('Missing parameter `context` for `useState`');
    }

    if (!stateHooks[context]) {
      stateHooks[context] = { state: [], index: 0 };
    }

    const contextStateIndex = stateHooks[context].index;
    const state = (
      stateHooks[context].state[contextStateIndex] !== undefined
        ? stateHooks[context].state[contextStateIndex]
        : initValue
    ) as UseStateValue;
    const _contextStateIndex = contextStateIndex;
    const setState = (newValue: UseStateValue) => {
      if (stateHooks[context].state[_contextStateIndex] !== newValue) {
        stateHooks[context].state[_contextStateIndex] = newValue;
      }

      render();
    };

    stateHooks[context].index++;

    return [state, setState];
  };
  const useEffect = async (
    callback: unknown | Promise<FunctionType> | FunctionType,
    dependencyArray: unknown[]
  ) => {
    const oldDependencies = effectHooks[effectIndex];

    let hasChanged = true;

    if (oldDependencies) {
      hasChanged = dependencyArray.some(
        (dep: unknown, i: number) => !Object.is(dep, oldDependencies[i])
      );
    }

    effectHooks[effectIndex] = dependencyArray;
    effectIndex++;

    if (hasChanged && callback && typeof callback === 'function') {
      if (callback.constructor.name === 'AsyncFunction') {
        await callback();
      } else {
        callback();
      }
    }
  };

  return {
    addOnClick,
    addOnRouteChange,
    addOnAfterAppRender,
    useEffect,
    useState,
    init,
    render
  };
})();

export const {
  addOnClick,
  addOnRouteChange,
  addOnAfterAppRender,
  useEffect,
  useState,
  init,
  render
} = spa;

export default spa;
