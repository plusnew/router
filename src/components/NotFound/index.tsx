import plusnew, { component, Props } from '@plusnew/core';
import activeRoutes from '../../contexts/activeRoutes';
import url from '../../contexts/url';
import urlHandler, { routeState } from '../../contexts/urlHandler';

type props = {
  children: any;
};

export default component(
  __dirname,
  (Props: Props<props>) =>
    <activeRoutes.Consumer>{activeRoutesState =>
      <url.Consumer>{urlState =>
        <urlHandler.Consumer>{(urlHandlerState) => {
          const activeRoute = activeRoutesState.find(routeChain =>
            urlHandlerState.getRouteState(routeChain, urlState) === routeState.active,
          );

          debugger;

          if (activeRoute === undefined) {
            return (
              <Props>{props =>
                props.children
              }</Props>
            );
          }

          return false;
        }}</urlHandler.Consumer>
      }</url.Consumer>
    }</activeRoutes.Consumer>,
);
