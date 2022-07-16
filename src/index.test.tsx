import { expect } from "@esm-bundle/chai";
import plusnew, { store } from "@plusnew/core";
import "@plusnew/driver-dom";
import driver from "@plusnew/driver-dom";
import { createRoute, serializer, StaticProvider, UrlConsumer } from "./index";

describe("api", () => {
  it("map handling", () => {
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
              {(urlState, redirect) => (
                <>
                  {(() =>
                    rootRoute.map(urlState, ({ isActiveAsParent, parameter }) =>
                      isActiveAsParent
                        ? null
                        : "root-" + parameter.rootPath.parentParam
                    ) ??
                    childARoute.map(
                      urlState,
                      ({ isActiveAsParent, parameter }) =>
                        isActiveAsParent
                          ? null
                          : "childA-" +
                            parameter.rootPath.parentParam +
                            "-" +
                            parameter.childAPath.firstChildParam +
                            "-" +
                            parameter.childAPath.secondChildParam
                    ) ??
                    childBRoute.map(
                      urlState,
                      ({ isActiveAsParent, parameter }) =>
                        isActiveAsParent
                          ? null
                          : "childB-" + parameter.rootPath.parentParam
                    ) ??
                    "not-found")()}
                  <button
                    id="rootButton"
                    onclick={() =>
                      redirect(
                        rootRoute.createUrl({
                          rootPath: { parentParam: "bar" },
                        })
                      )
                    }
                  />
                  <a
                    id="childALink"
                    href={childARoute.createUrl({
                      rootPath: { parentParam: "bar" },
                      childAPath: {
                        firstChildParam: 1,
                        secondChildParam: "mep",
                      },
                    })}
                  />
                  <a
                    href={childBRoute.createUrl({
                      rootPath: { parentParam: "baz" },
                      childBPath: {},
                    })}
                  >
                    <span id="childBLink" />
                  </a>
                </>
              )}
            </UrlConsumer>
          </StaticProvider>
        )}
      </urlStore.Observer>,
      { driver: driver(container) }
    );

    expect(container.textContent).to.equal("root-foo");

    container
      .querySelector("#rootButton")
      ?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );

    expect(container.textContent).to.equal("root-bar");

    const childAEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    (container.querySelector("#childALink") as HTMLElement).dispatchEvent(
      childAEvent
    );

    expect(container.textContent).to.equal("childA-bar-1-mep");
    expect(childAEvent.defaultPrevented).to.eq(true);

    (container.querySelector("#childBLink") as HTMLElement).dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );

    expect(container.textContent).to.equal("childB-baz");

    component.remove(false);
  });
});
