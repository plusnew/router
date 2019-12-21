import plusnew, { component, Props } from '@plusnew/core';
import urlHandler from '../../contexts/urlHandler';
import url from '../../contexts/url';
import activeRoutes from 'contexts/activeRoutes';

type props = {
  children: any;
};

export default component(
  __dirname,
  (Props: Props<props>) =>
    <activeRoutes.Consumer>{activeRoutesState =>
      <url.Consumer>{urlState =>
        <urlHandler.Consumer>{(urlHandlerState) => {
          const activeBrokenRoute = activeRoutesState.find((routeChain) => {
            if (urlHandlerState.isNamespaceActive(routeChain, urlState)) {
              try {
                urlHandlerState.parseUrl(routeChain, urlState);
              } catch (error) {
                return true;
              }
            }
            return false;
          });

          if (activeBrokenRoute === undefined) {
            return false;
          }

          return (
            <Props>{props => props.children}</Props>
          );
        }}</urlHandler.Consumer>
      }</url.Consumer>
    }</activeRoutes.Consumer>,
);
