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

    const childARoute = rootRoute.createChildRoute("childAPath", {
      childParam: [serializer.number()],
    } as const);

    const childBRoute = rootRoute.createChildRoute("childBPath", {
      childParam: [serializer.number()],
    } as const);

    const component = plusnew.render(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider state={urlState} dispatch={urlStore.dispatch}>
            <UrlConsumer>
              {(urlState) => {
                const rootRouteState = rootRoute.parseUrl(urlState);

                if (rootRouteState.isActive) {
                  return (
                    "root-" + rootRouteState.parameter.rootPath.parentParam
                  );
                }

                const childARouteState = childARoute.parseUrl(urlState);

                if (childARouteState.isActive) {
                  return (
                    "childA-" +
                    childARouteState.parameter.rootPath.parentParam +
                    childARouteState.parameter.childAPath.childParam
                  );
                }

                const childBRouteState = childARoute.parseUrl(urlState);

                if (childBRouteState.isActive) {
                  return (
                    "childB-" +
                    childBRouteState.parameter.rootPath.parentParam +
                    childBRouteState.parameter.childAPath.childParam
                  );
                }

                return "not-found";
              }}
            </UrlConsumer>
            <button
              id="rootButton"
              onclick={() =>
                urlStore.dispatch(
                  rootRoute.createUrl({ rootPath: { parentParam: "bar" } })
                )
              }
            />
            <button
              id="childAButton"
              onclick={() =>
                urlStore.dispatch(
                  childARoute.createUrl({
                    rootPath: { parentParam: "bar" },
                    childAPath: { childParam: 1 },
                  })
                )
              }
            />
            <button
              id="childBButton"
              onclick={() =>
                urlStore.dispatch(
                  childBRoute.createUrl({
                    rootPath: { parentParam: "bar" },
                    childBPath: { childParam: 2 },
                  })
                )
              }
            />
          </StaticProvider>
        )}
      </urlStore.Observer>,
      { driver: driver(container) }
    );

    expect(container.textContent).to.equal("root-foo");

    container
      .querySelector("#rootButton")
      ?.dispatchEvent(new MouseEvent("click"));

    expect(container.textContent).to.equal("root-bar");

    container
      .querySelector("#childAButton")
      ?.dispatchEvent(new MouseEvent("click"));

    expect(container.textContent).to.equal("childA-bar1");

    container
      .querySelector("#childBButton")
      ?.dispatchEvent(new MouseEvent("click"));

    expect(container.textContent).to.equal("childB-bar2");

    component.remove(false);
  });
});
