// eslint-disable-next-line no-unused-vars
export type FunctionType = (...args: unknown[]) => void;


export type EventDataId = {
  id: string;
  // eslint-disable-next-line no-unused-vars
  callback: EventDataAction;
};

// eslint-disable-next-line no-unused-vars
export type EventDataAction = (...args: unknown[]) => void;

export type EventDataSelector = {
  selector: string;
  // eslint-disable-next-line no-unused-vars
  callback: EventDataAction;
};

// eslint-disable-next-line no-unused-vars
export type EventDataUnion<T> = FunctionType | T;

export type EventArray<T> = EventDataUnion<T>[];

export type UseStateValue =
  | boolean
  | string
  | number
  | unknown[]
  | Record<string, unknown>;

// eslint-disable-next-line no-unused-vars
export type UseStateReturn = [
  UseStateValue,
  FunctionType
];

export type StateContext = {
  state: UseStateValue[];
  index: number;
};

/**
 * Represents the event object for an element.
 * @template T - Type of the element used as a target.
 */
export type EventType<T> = Event & {
  target: T & {
    files?: FileList | null;
    id: string;
    parentElement: Element | null;
  };
  currentTarget: HTMLElement & {
    documentElement: HTMLElement;
  };
};

/**
 * Represents the keyboard event object for an element.
 * @template T - Type of the element used as a target.
 */
export type KeyboardEventType<T> = KeyboardEvent & {
  target: T & {
    id: string;
  };
  currentTarget: HTMLElement & {
    documentElement: HTMLElement;
  };
};

export type NavigateToEvent = Event & {
  detail: {
    to: string;
  };
};

export type Route = {
  name: string;
  path?: string;
  page?: string;
  regex?: RegExp;
  layout?: string;
};

export type PreviousRoute = {
  name: string;
};

export type Routes = Route[];

export type RouteDetails = {
  page: RouterMatch;
  previousPage: RouterMatch;
  previousParams: unknown;
  currentParams: unknown;
  paramsChanged: boolean;
  routeChanged: boolean;
};

export type RouterMatch = {
  route: Route;
  result?: RegExpMatchArray | null;
};
