import plusnew, { Component, Props } from "@plusnew/core";
import type ComponentInstance from "@plusnew/core/src/instances/types/Component/Instance";
import activeRoutes from "../../../contexts/activeRoutes";
import url from "../../../contexts/url";
import urlHandler, { routeState } from "../../../contexts/urlHandler";
import type { parameterSpecTemplate } from "../../../types/mapper";
import type { routeContainer } from "../../../types/route";

export default function <
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<routeName, parameterSpec, parentParameter>[]) {
  return class Link extends Component<{}> {
    static displayName = "RouteComponent";
    render(
      _Props: Props<{}>,
      componentInstance: ComponentInstance<any, any, any>
    ) {
      componentInstance.registerLifecycleHook("componentDidMount", () => {
        const activeRouteProvider = activeRoutes.findProvider(
          componentInstance
        );

        activeRouteProvider.dispatch({
          type: "mount",
          payload: routeChain,
        });
      });

      componentInstance.registerLifecycleHook("componentWillUnmount", () => {
        const activeRouteProvider = activeRoutes.findProvider(
          componentInstance
        );

        activeRouteProvider.dispatch({
          type: "unmount",
          payload: routeChain,
        });
      });

      return (
        <url.Consumer>
          {(urlState) => (
            <urlHandler.Consumer>
              {(urlHandlerState) => {
                if (
                  urlHandlerState.getRouteState(routeChain, urlState) ===
                  routeState.active
                ) {
                  try {
                    const parameter = urlHandlerState.getParameter<
                      routeName,
                      parameterSpec,
                      parentParameter
                    >(routeChain, urlState);
                    const route = routeChain[routeChain.length - 1];

                    return <route.component parameter={parameter} />;
                  } catch (error) {
                    // In case of error, the component will not be shown, but the <Invalid /> component
                  }
                }

                return null;
              }}
            </urlHandler.Consumer>
          )}
        </url.Consumer>
      );
    }
  };
}
