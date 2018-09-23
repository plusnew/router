import Route from './Route';
import { provider } from 'types/provider';

export default class Router {
  provider: provider;
  route: Route;
  createRoute: typeof Route.prototype.createRoute;

  constructor(provider: provider) {
    this.provider = provider;
    this.route = new Route(this);
    this.createRoute = this.route.createRoute;
  }
}
