import Router from '../index';
import { RouteParamsSpec } from '../../types/mapper';
import UrlHandler from './UrlHandler';
import linkFactory from './linkFactory';
import storeFactory from './storeFactory';
import componentFactory, { routeCallback } from './componentFactory';
import { ComponentContainer } from 'plusnew';
import { props } from 'plusnew/dist/src/interfaces/component';

export default class Route {
  private router: Router;

  constructor (router: Router) {
    this.router = router;
  }

  createRoute<params extends RouteParamsSpec, componentProps extends Partial<props>>(namespace: string, params: params, callback: routeCallback<params, componentProps>) {
    const urlHandler = new UrlHandler(namespace, params);
    const store = storeFactory(this.router, urlHandler);

    return {
      urlHandler,
      store,
      Component: componentFactory(this.router, store, callback) as ComponentContainer<componentProps>,
      Link: linkFactory(this.router, store, urlHandler),

    };
  }
}
