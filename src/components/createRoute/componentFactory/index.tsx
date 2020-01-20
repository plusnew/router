import plusnew, { Component, Props } from '@plusnew/core';
import ComponentInstance from '@plusnew/core/src/instances/types/Component/Instance';
import activeRoutes from '../../../contexts/activeRoutes';
import url from '../../../contexts/url';
import urlHandler, { routeState } from '../../../contexts/urlHandler';
import { parameterSpecTemplate } from '../../../types/mapper';
import { routeContainer } from '../../../types/route';

export default function <
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<routeName, parameterSpec, parentParameter>[]) {
  return class Link extends Component<{}> {
    static displayName = 'RouteComponent';
    render(_Props: Props<{}>, componentInstance: ComponentInstance<any, any, any>) {
      componentInstance.registerLifecycleHook('componentDidMount', () => {
        const activeRouteProvider = activeRoutes.findProvider(componentInstance);

        activeRouteProvider.props.dispatch({
          type: 'mount',
          payload: routeChain,
        });
      });

      componentInstance.registerLifecycleHook('componentWillUnmount', () => {
        const activeRouteProvider = activeRoutes.findProvider(componentInstance);

        activeRouteProvider.props.dispatch({
          type: 'unmount',
          payload: routeChain,
        });
      });

      return (
        <url.Consumer>{urlState =>
          <urlHandler.Consumer>{(urlHandlerState) => {
            if (urlHandlerState.getRouteState(routeChain, urlState) === routeState.active) {
              try {
                const parameter = urlHandlerState.getParameter<
                  routeName,
                  parameterSpec,
                  parentParameter>(routeChain, urlState);
                const route = routeChain[routeChain.length - 1];

                return <route.component parameter={parameter} />;
              } catch (error) {

              }
            }

            return null;
          }}</urlHandler.Consumer>
        }</url.Consumer>
      );
    }
  };
}
