import Router from '../index';
import { RouteParamsSpec } from '../../types/mapper';
import UrlHandler from './UrlHandler';
import linkFactory from './linkFactory';
import storeFactory, { routeStore } from './storeFactory';
import componentFactory, { routeCallback } from './componentFactory';
import { ComponentContainer } from 'plusnew';
import { props } from 'plusnew/dist/src/interfaces/component';

enum routerStateTypes {
  active,
  notFound,
  invalid,
}

export default class RouteHandler {
  private router: Router;
  private routeStores: routeStore<any>[];

  constructor (router: Router) {
    this.routeStores = [];
    this.router = router;
  }

  public createRoute<params extends RouteParamsSpec, componentProps extends Partial<props>>(namespace: string, params: params, callback: routeCallback<params, componentProps>) {
    const urlHandler = new UrlHandler(namespace, params);
    const store = storeFactory(this.router, urlHandler);

    this.routeStores.push(store);
    this.updateRouterState();

    // The updateRouterState should be executed last, thats why it needs removal and adding
    this.router.provider.store.removeOnChange(this.updateRouterState);
    this.router.provider.store.addOnChange(this.updateRouterState);
    this.router.rootPathStore.removeOnChange(this.updateRouterState);
    this.router.rootPathStore.addOnChange(this.updateRouterState);

    return {
      urlHandler,
      store,
      Component: componentFactory(store, callback) as ComponentContainer<componentProps>,
      Link: linkFactory(this.router, store, urlHandler),

    };
  }

  private updateRouterState = () => {
    const routerState = this.routeStores.reduce((current, routeStore) => {
      const routeState = routeStore.getCurrentState();
      if (routeState.invalid) {
        return routerStateTypes.invalid;
      }
      if (routeState.active) {
        return routerStateTypes.active;
      }
      return current;
    }, routerStateTypes.notFound);

    if (routerState === routerStateTypes.notFound) {
      this.router.NotFound.store.dispatch(true);
      this.router.Invalid.store.dispatch(false);
    }

    if (routerState === routerStateTypes.invalid) {
      this.router.NotFound.store.dispatch(false);
      this.router.Invalid.store.dispatch(true);
    }

    if (routerState === routerStateTypes.active) {
      this.router.NotFound.store.dispatch(false);
      this.router.Invalid.store.dispatch(false);
    }
  }
}
