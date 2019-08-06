import activeRoutes, { route } from 'contexts/activeRoutes';
import plusnew, { Component, ComponentContainer, Props } from '@plusnew/core';
import ComponentInstance from 'plusnew/dist/src/instances/types/Component/Instance';
import url from '../../../contexts/url';
import urlHandler from '../../../contexts/urlHandler';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';

export type RouteComponent<Spec extends RouteParamsSpec, props> = ComponentContainer<{ props: props, parameter: SpecToType<Spec> }>;

export default function <
  params extends RouteParamsSpec,
  componentProps
>(namespaces: string[], params: params, RouteComponent: RouteComponent<params, componentProps>) {
  return class RouterComponent extends Component<componentProps>{
    static displayName = 'RouterComponent';
    render(Props: Props<componentProps>, componentInstance: ComponentInstance<any>) {
      componentInstance.registerLifecycleHook('componentDidMount', () => {
        const activeRouteProvider = activeRoutes.findProvider(componentInstance);

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
        const activeRouteProvider = activeRoutes.findProvider(componentInstance);

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
