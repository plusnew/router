import { provider } from "../../types/provider";
import Router from '../index';
import { RouteParamsSpec, SpecToType } from "../../types/mapper";
import urlBuilderFactory from './urlBuilderFactory';
import linkFactory from './linkFactory';
import storeFactory from './storeFactory';
import componentFactory from './componentFactory';

type routeCallback<params extends RouteParamsSpec> = (params: SpecToType<params>) => void;

export default class Route {
  private router: Router;

  constructor (router: Router) {
    this.router = router;
  }

  createRoute() {
    return <params extends RouteParamsSpec>(namespace: string, params: params, callback: routeCallback<params>) => {
      const urlBuilder = urlBuilderFactory(namespace, params);

      return {
        urlBuilder,
        Component: componentFactory(this.router, namespace, params),
        // Component: componentFactory(provider, namespace, params),

      };
    };
  }
}
