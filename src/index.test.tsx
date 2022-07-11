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
      firstChildParam: [serializer.number()],
      secondChildParam: [serializer.string()],
    } as const);

    const childBRoute = rootRoute.createChildRoute("childBPath", {} as const);

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
                    "-" +
                    childARouteState.parameter.childAPath.firstChildParam +
                    "-" +
                    childARouteState.parameter.childAPath.secondChildParam
                  );
                }

                const childBRouteState = childARoute.parseUrl(urlState);

                if (childBRouteState.isActive) {
                  return (
                    "childB-" + childBRouteState.parameter.rootPath.parentParam
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
                    childAPath: { firstChildParam: 1, secondChildParam: "mep" },
                  })
                )
              }
            />
            <button
              id="childBButton"
              onclick={() =>
                urlStore.dispatch(
                  childBRoute.createUrl({
                    rootPath: { parentParam: "baz" },
                    childBPath: {},
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

    expect(container.textContent).to.equal("childA-bar-1-mep");

    container
      .querySelector("#childBButton")
      ?.dispatchEvent(new MouseEvent("click"));

    expect(container.textContent).to.equal("childB-baz");

    component.remove(false);
  });
});
