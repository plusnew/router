import type { Props } from "@plusnew/core";
import { store } from "@plusnew/core";
import plusnew, { component } from "@plusnew/core";
import routeContext from "./route";

type props = {
  children: any;
};
export default {
  Provider: component("RouteProvider", (Props: Props<props>) => {
    const url = store(location.pathname);

    return (
      <url.Observer>
        {(urlState) => (
          <routeContext.Provider
            state={urlState}
            dispatch={(path) => {
              history.pushState({}, "", path);
              url.dispatch(path);
            }}
          >
            <Props>{(props) => props.children}</Props>
          </routeContext.Provider>
        )}
      </url.Observer>
    );
  }),
};
