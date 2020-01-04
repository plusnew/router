import plusnew, { component, Props } from '@plusnew/core';
import activeRoutesContext, { storeFactory as activeRouteStoreFactory } from '../../contexts/activeRoutes';
import url from '../../contexts/url';
import urlHandler from '../../contexts/urlHandler';
import { createUrl, isNamespaceActive, isNamespaceActiveAsParent, parseUrl } from '../../util/urlHandler';

type props = {
  url: string;
  onchange: (url: string) => void;
  children: any;
};

export default component(
  'StaticProvider',
  (Props: Props<props>) => {
    const activeRoutes = activeRouteStoreFactory();

    return (
        <urlHandler.Provider
          state={{
            isNamespaceActive,
            isNamespaceActiveAsParent,
            createUrl,
            parseUrl,
          }}
          dispatch={null as never}
        >
          <Props>{props =>
            <url.Provider state={props.url} dispatch={props.onchange}>
              <activeRoutes.Observer>{activeRouteState =>
                <activeRoutesContext.Provider state={activeRouteState} dispatch={activeRoutes.dispatch}>
                  {props.children}
                </activeRoutesContext.Provider>
              }</activeRoutes.Observer>
            </url.Provider>
          }</Props>
        </urlHandler.Provider>
    );

  },
);
