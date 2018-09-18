import { provider } from '../../types/provider';
import Router from '../index';
import { RouteParamsSpec, SpecToType } from '../../types/mapper';
import urlBuilderFactory from './urlBuilderFactory';
import linkFactory from './linkFactory';
import storeFactory from './storeFactory';
import componentFactory from './componentFactory';
import { ApplicationElement, ComponentContainer } from 'plusnew';
import { props } from 'plusnew/dist/src/interfaces/component';

type routeCallback<params extends RouteParamsSpec, props> = (params: SpecToType<params>, props: props) => ApplicationElement;

export default class Route {
  private router: Router;

  constructor (router: Router) {
    this.router = router;
  }

  createRoute<params extends RouteParamsSpec, componentProps extends Partial<props>>(namespace: string, params: params, callback: routeCallback<params, componentProps>) {
    const buildUrl = urlBuilderFactory(namespace, params);

    return {
      buildUrl,
      Component: componentFactory(this.router, namespace, params, callback) as ComponentContainer<componentProps>,
      // Component: componentFactory(provider, namespace, params),

    };
  }
}
