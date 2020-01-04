import plusnew, { component, Props } from '@plusnew/core';
import activeRoutes from '../../contexts/activeRoutes';
import url from '../../contexts/url';
import urlHandler from '../../contexts/urlHandler';

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
            urlHandlerState.isNamespaceActive(routeChain, urlState),
          );

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
