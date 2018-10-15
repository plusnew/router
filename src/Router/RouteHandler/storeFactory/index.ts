import { store, storeType } from 'plusnew';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import Router from '../../../';
import UrlHandler from '../UrlHandler';

type activeRouteState<Spec extends RouteParamsSpec> = {
  active: true;
  invalid: false;
  params: SpecToType<Spec>;
};

type inactiveRouteState = {
  active: false;
  invalid: false;
};

type invalidRouteState = {
  active: false;
  invalid: true;
};

type activeRouteAction<Spec extends RouteParamsSpec> = {
  type: 'active';
  data: SpecToType<Spec>
};

type inactiveRouteAction = {
  type: 'inactive';
};

type invalidRouteAction = {
  type: 'invalid';
};

type routeStoreState<Spec extends RouteParamsSpec> = activeRouteState<Spec> | inactiveRouteState | invalidRouteState;
type routeStoreAction<Spec extends RouteParamsSpec> = activeRouteAction<Spec> | inactiveRouteAction | invalidRouteAction;

export type routeStore<Spec extends RouteParamsSpec> = storeType<routeStoreState<Spec>, routeStoreAction<Spec>>;

function getAction<Spec extends RouteParamsSpec>(url: string, urlHandler: UrlHandler<Spec>) {
  let result: routeStoreAction<Spec> = {
    type: 'inactive',
  };

  if (urlHandler.isCurrentNamespace(url) === true) {
    result = {
      type: 'invalid',
    };
    try {
      const params = urlHandler.parseUrl(url);
      result = {
        type: 'active',
        data: params,
      };
    } catch (error) {
      console.error(error);
    }
  }
  return result;
}

export default function <Spec extends RouteParamsSpec>(router: Router, urlHandler: UrlHandler<Spec>) {
  const routeStore = store({ active: false, invalid: false } as routeStoreState<Spec>, (_state, action: routeStoreAction<Spec>) => {
    if (action.type === 'active') {
      const result: activeRouteState<Spec> = {
        active: true,
        invalid: false,
        params: action.data,
      };
      return result;
    }
    if (action.type === 'inactive') {
      const result: inactiveRouteState =  {
        active: false,
        invalid: false,
      };
      return result;
    }
    if (action.type === 'invalid') {
      const result: invalidRouteState =  {
        active: false,
        invalid: true,
      };
      return result;
    }
    throw new Error('Invalid action for routestore');
  });

  const updateRouteStore = () => {
    let url = router.provider.store.getState();
    if (url === '/') { // If url is root, then use predefined root-path
      url = router.rootPathStore.getState();
    }
    routeStore.dispatch(getAction(url, urlHandler));
  };

  router.provider.store.subscribe(updateRouteStore);
  router.rootPathStore.subscribe(updateRouteStore);

  updateRouteStore();

  return routeStore;
}
