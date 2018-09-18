import { provider } from "../../types/provider";
import Router from '../index';
import { RouteParamsSpec, SpecToType } from "../../types/mapper";
import urlBuilderFactory from './urlBuilderFactory';
import linkFactory from './linkFactory';
import storeFactory from './storeFactory';
import componentFactory from './componentFactory';

type routeCallback<params extends RouteParamsSpec, props> = (params: SpecToType<params>, props: props) => void;

export default class Route {
  private router: Router;

  constructor (router: Router) {
    this.router = router;
  }

  createRoute<params extends RouteParamsSpec, props>(namespace: string, params: params, callback: routeCallback<params, props>) {
    const urlBuilder = urlBuilderFactory(namespace, params);

    return {
      urlBuilder,
      Component: componentFactory(this.router, namespace, params, callback),
      // Component: componentFactory(provider, namespace, params),

    };
  }
}
