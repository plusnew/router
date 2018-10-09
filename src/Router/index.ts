import Route from './Route';
import { provider } from 'types/provider';

export default class Router {
  public provider: provider;
  private route: Route;
  public rootPath: string;
  public createRoute: typeof Route.prototype.createRoute;

  constructor(rootPath: string, provider: provider) {
    this.provider = provider;
    this.route = new Route(this);
    this.createRoute = this.route.createRoute;
    this.rootPath = rootPath;
  }
}
