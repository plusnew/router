import plusnew, { Component, Props, ComponentContainer, Instance } from 'plusnew';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import url from '../../../contexts/url';
import urlHandler from '../../../contexts/urlHandler';
import activeRoutes, { route } from 'contexts/activeRoutes';
import ComponentInstance from 'plusnew/dist/src/instances/types/Component/Instance';

export type RouteComponet<Spec extends RouteParamsSpec, props> = ComponentContainer<{ props: props, parameter: SpecToType<Spec> }>;

function search<props>(target: Instance | Instance, searchInstance: ComponentContainer<props>): Instance {
  if (target.type === searchInstance) {
    return target;
  }

  if (target.parentInstance) {
    return search(target.parentInstance, searchInstance);
  }

  throw new Error('Could not find Provider');
}

export default function <
  params extends RouteParamsSpec,
  componentProps
>(namespaces: string[], params: params, RouteComponent: RouteComponet<params, componentProps>) {
  return class RouterComponent extends Component<componentProps>{

    render(Props: Props<componentProps>, componentInstance: ComponentInstance<any>) {
      componentInstance.registerLifecycleHook('componentDidMount', () => {
        const activeRouteProvider = search(componentInstance, activeRoutes.Provider);

        const props = activeRouteProvider.props as {
          state: route[],
          dispatch: (routes: route[]) => void;
        };

        props.dispatch([
          ...props.state,
          {
            namespaces,
            spec: params,
          },
        ]);
      });

      componentInstance.registerLifecycleHook('componentWillUnmount', () => {
        const activeRouteProvider = search(componentInstance, activeRoutes.Provider);

        const props = activeRouteProvider.props as {
          state: route[],
          dispatch: (routes: route[]) => void;
        };

        props.dispatch(props.state.filter(route => route.namespaces !== namespaces));
      });

      return (
        <urlHandler.Consumer>{linkState =>
          <url.Consumer>{(urlState) => {
            const activeNamespace = namespaces.find(namespace => linkState.isNamespaceActive(namespace, urlState));

            if (activeNamespace === undefined) {
              return false;
            }

            let parameter: SpecToType<params>;
            try {
              parameter = linkState.parseUrl(activeNamespace, params, urlState);
            } catch (error) {
              return false;
            }

            return (
              <Props>{props =>
                <RouteComponent
                  parameter={parameter}
                  props={props}
                />
              }</Props>
            );
          }}</url.Consumer>
        }</urlHandler.Consumer>
      );
    }
  };
}
