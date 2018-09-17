import { provider } from '../types/provider';
import route from './route';

export default class Router {
  provider: provider;
  constructor(provider: provider) {
    this.provider = provider;
    this.createRoute = route(this);
  }
  createRoute: () => {

  };
}
