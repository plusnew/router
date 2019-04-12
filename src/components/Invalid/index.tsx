import plusnew, { component, Props } from 'plusnew';
import urlHandler from 'contexts/urlHandler';
import url from 'contexts/url';
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
          const activeBrokenRoute = activeRoutesState.find(route =>
            route.namespaces.find((namespace) => {
              if (urlHandlerState.isNamespaceActive(namespace, urlState)) {
                try {
                  urlHandlerState.parseUrl(namespace, route.spec, urlState);
                } catch (error) {
                  return true;
                }
              }
              return false;
            }) !== undefined,
          );

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
