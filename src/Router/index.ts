import RouteHandler from './RouteHandler';
import { provider } from '../types/provider';
import notFoundFactory from './notFoundFactory';
import invalidFactory from './invalidFactory';
import { store, storeType } from 'plusnew';

type redirect = { from: string, to: string };

export default class Router {
  public provider: provider;
  private route: RouteHandler;
  public redirectStore: storeType<redirect[], redirect>;
  public createRoute: typeof RouteHandler.prototype.createRoute;
  public NotFound = notFoundFactory();
  public Invalid = invalidFactory();

  constructor(provider: provider) {
    this.provider = provider;
    this.route = new RouteHandler(this);
    this.createRoute = (...args) => this.route.createRoute(...args);
    // @FIXME use this when typescript supports bind
    // this.createRoute = this.route.createRoute.bind(this.route);
    this.redirectStore = store([] as redirect[], (state, action: redirect) => [...state, action]);
  }
}
