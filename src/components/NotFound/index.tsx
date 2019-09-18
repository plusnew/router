import plusnew, { component, Props } from '@plusnew/core';
import urlHandler from '../../contexts/urlHandler';
import url from '../../contexts/url';
import activeRoutes from '../../contexts/activeRoutes';

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
            urlHandlerState.isNamespaceActive(route.namespace, urlState),
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
