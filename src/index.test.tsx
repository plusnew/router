import plusnew, { store } from "@plusnew/core";
import "@plusnew/driver-dom";
import { expect } from "@esm-bundle/chai";
import { StaticProvider, UrlConsumer, createRoute, serializer } from "./index";
import driver from "@plusnew/driver-dom";

describe("api", () => {
  it("does createroute work as expected", () => {
    const container = document.createElement("div");
    const urlStore = store("/rootPath;parentParam=foo");

    const rootRoute = createRoute("rootPath", {
      parentParam: [serializer.string()],
    } as const);

    const component = plusnew.render(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider state={urlState} dispatch={urlStore.dispatch}>
            <UrlConsumer>
              {(urlState) => {
                const rootRouteState = rootRoute.parseUrl(urlState);

                return (
                  rootRouteState.isActive &&
                  rootRouteState.parameter.rootPath.parentParam
                );
              }}
            </UrlConsumer>
          </StaticProvider>
        )}
      </urlStore.Observer>,
      { driver: driver(container) }
    );

    expect(container.textContent).to.equal("foo");

    component.remove(false);
  });
});
