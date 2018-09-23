import { provider } from '../../types/provider';
import Router from '../index';
import { RouteParamsSpec } from '../../types/mapper';
import urlBuilderFactory from './urlBuilderFactory';
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
    const buildUrl = urlBuilderFactory(namespace, params);
    // const 

    return {
      buildUrl,
      Component: componentFactory(this.router, namespace, params, callback) as ComponentContainer<componentProps>,
      // Component: componentFactory(provider, namespace, params),

    };
  }
}
