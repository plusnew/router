import { expect } from "@esm-bundle/chai";
import plusnew, {component, type Props, store, context } from "@plusnew/core";
import "@plusnew/driver-dom";
import driver from "@plusnew/driver-dom";
import { createRoute, serializer } from "./index";

const contextResult = context<string, string>();

function hasModifier(evt: MouseEvent) {
  return (
    evt.altKey === true ||
    evt.ctrlKey === true ||
    evt.shiftKey === true ||
    evt.metaKey === true
  );
}

function findLink(element: HTMLElement): URL | null {
  if (element.tagName === "A") {
    return new URL((element as HTMLAnchorElement).href);
  } else if (element.parentElement) {
    return findLink(element.parentElement);
  } else {
    return null;
  }
}

const result = {
  Consumer: contextResult.Consumer,
  findProvider: contextResult.findProvider,
  Provider: component(
    "RouteProvider",
    (
      Props: Props<{
        state: string;
        dispatch: (action: string) => boolean;
        children: any;
      }>,
      componentInstance
    ) => {
      const selfUrl = new URL(location.href);
      const eventListener = (evt: MouseEvent) => {
        const link = findLink(evt.target as HTMLElement);

        if (hasModifier(evt) === false && link !== null) {
          if (
            selfUrl.origin === link.origin &&
            Props.getState().dispatch(link.pathname)
          ) {
            evt.preventDefault();
          }
        }
      };
      const rootElement = componentInstance.renderOptions.driver.getRootElement(
        null as any
      ) as HTMLElement;
      componentInstance.registerLifecycleHook("componentDidMount", () =>
        rootElement.addEventListener("click", eventListener)
      );
      componentInstance.registerLifecycleHook("componentWillUnmount", () =>
        rootElement.removeEventListener("click", eventListener)
      );

      return (
        <Props>
          {(props) => (
            <contextResult.Provider
              state={props.state}
              dispatch={props.dispatch}
            >
              {props.children}
            </contextResult.Provider>
          )}
        </Props>
      );
    }
  ),
};

const StaticProvider = result.Provider;
const UrlConsumer = result.Consumer;

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
                        rootRoute.createPath({
                          rootPath: { parentParam: "bar" },
                        })
                      )
                    }
                  />
                  <a
                    id="childALink"
                    href={childARoute.createPath({
                      rootPath: { parentParam: "bar" },
                      childAPath: {
                        firstChildParam: 1,
                        secondChildParam: "mep",
                      },
                    })}
                  />
                  <a
                    href={
                      childBRoute.createPath({
                        rootPath: { parentParam: "baz" },
                        childBPath: {},
                      }) + "/" // add trailing slash
                    }
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

  it("namespaces starting with same name", () => {
    const foo = createRoute("foo", {});
    const foobar = createRoute("foobar", {});
    expect(
      foo.map(foobar.createPath({ foobar: {} }), (value) => value)
    ).to.equal(null);
  });
});
