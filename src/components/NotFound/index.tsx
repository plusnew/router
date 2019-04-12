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
          const activeRoute = activeRoutesState.find(route =>
            route.namespaces.find(namespace =>
              urlHandlerState.isNamespaceActive(namespace, urlState),
            ) !== undefined,
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
