import plusnew, { component, Props } from "@plusnew/core";
import activeRoutes from "../../contexts/activeRoutes";
import url from "../../contexts/url";
import urlHandler, { routeState } from "../../contexts/urlHandler";

type props = {
  children: any;
};

export default component("RouteInvalid", (Props: Props<props>) => (
  <activeRoutes.Consumer>
    {(activeRoutesState) => (
      <url.Consumer>
        {(urlState) => (
          <urlHandler.Consumer>
            {(urlHandlerState) => {
              const activeBrokenRoute = activeRoutesState.find((routeChain) => {
                if (
                  urlHandlerState.getRouteState(routeChain, urlState) !==
                  routeState.inactive
                ) {
                  try {
                    urlHandlerState.getParameter(routeChain, urlState);
                  } catch (error) {
                    return true;
                  }
                }
                return false;
              });

              if (activeBrokenRoute === undefined) {
                return false;
              }

              return <Props>{(props) => props.children}</Props>;
            }}
          </urlHandler.Consumer>
        )}
      </url.Consumer>
    )}
  </activeRoutes.Consumer>
));
