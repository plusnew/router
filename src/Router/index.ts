import Route from './Route';
import { storeType } from 'plusnew';

export default class Router {
  urlStore: storeType<string, string>;
  route: Route;
  createRoute: typeof Route.prototype.createRoute;

  constructor(urlStore: storeType<string, string>) {
    this.urlStore = urlStore;
    this.route = new Route(this);
    this.createRoute = this.route.createRoute;
  }
}
