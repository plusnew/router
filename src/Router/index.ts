import Route from './Route';
import { provider } from 'types/provider';
import notFoundFactory from './notFoundFactory';
import invalidFactory from './invalidFactory';
import { ComponentContainer } from 'plusnew';

export default class Router {
  public provider: provider;
  private route: Route;
  public rootPath: string;
  public createRoute: typeof Route.prototype.createRoute;
  public NotFound: ComponentContainer<{children: any}>;
  public Invalid: ComponentContainer<{children: any}>;

  constructor(rootPath: string, provider: provider) {
    this.provider = provider;
    this.route = new Route(this);
    this.createRoute = (...args) => this.route.createRoute(...args);
    // @FIXME use this when typescript supports bind
    // this.createRoute = this.route.createRoute.bind(this.route);
    this.rootPath = rootPath;
    this.NotFound = notFoundFactory(this);
    this.Invalid = invalidFactory(this);
  }
}
