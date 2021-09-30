import { configure } from "enzyme";
import enzymeAdapterPlusnew, { mount } from "@plusnew/enzyme-adapter";
import plusnew, { store, component } from "@plusnew/core";
import createRoute from "../index";
import { StaticProvider } from "../../..";

configure({ adapter: new enzymeAdapterPlusnew() });

describe("linkFactory", () => {
  it("when clicked, preventDefault should have been triggered", () => {
    const urlStore = store("/");
    const fooRoute = createRoute(
      "foo",
      {} as const,
      component("FooComponent", () => <div />)
    );
    const routeClick = jasmine.createSpy("clickSpy");

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <fooRoute.Link
              parameter={{
                foo: {},
              }}
              class="link-class"
              classActive="link-class-active"
              onclick={routeClick}
            >
              link
            </fooRoute.Link>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    expect(wrapper.find("a").hasClass("link-class")).toBe(true);
    expect(wrapper.find("a").hasClass("link-class-active")).toBe(false);

    const clickEvent = new MouseEvent("click", {
      cancelable: true,
    });

    (wrapper.find("a").getDOMNode() as HTMLElement).dispatchEvent(clickEvent);

    expect(urlStore.getState()).toBe("/foo");
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(wrapper.find("a").hasClass("link-class")).toBe(true);
    expect(wrapper.find("a").hasClass("link-class-active")).toBe(true);
    expect(routeClick).toHaveBeenCalled();
  });

  it("when clicked with ctrl, preventDefault should not be triggered", () => {
    const urlStore = store("/");
    const fooRoute = createRoute(
      "foo",
      {} as const,
      component("FooComponent", () => <div />)
    );

    const clickSpy = jasmine
      .createSpy("clickSpy", (evt: Event) => {
        expect(evt.defaultPrevented).toBe(false);
        evt.preventDefault();
      })
      .and.callThrough();
    const routeClick = jasmine.createSpy("clickSpy");

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
                onclick={routeClick}
              >
                link
              </fooRoute.Link>
            </div>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    const clickEvent = new MouseEvent("click", {
      cancelable: true,
      bubbles: true,
      ctrlKey: true,
    });

    (wrapper.find("a").getDOMNode() as HTMLElement).dispatchEvent(clickEvent);

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
    expect(routeClick).not.toHaveBeenCalled();
  });

  it("when clicked with alt, preventDefault should not be triggered", () => {
    const urlStore = store("/");
    const fooRoute = createRoute(
      "foo",
      {} as const,
      component("FooComponent", () => <div />)
    );

    const clickSpy = jasmine
      .createSpy("clickSpy", (evt: Event) => {
        expect(evt.defaultPrevented).toBe(false);
        evt.preventDefault();
      })
      .and.callThrough();
    const routeClick = jasmine.createSpy("clickSpy");

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
                onclick={routeClick}
              >
                link
              </fooRoute.Link>
            </div>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    const clickEvent = new MouseEvent("click", {
      cancelable: true,
      bubbles: true,
      altKey: true,
    });

    (wrapper.find("a").getDOMNode() as HTMLElement).dispatchEvent(clickEvent);

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
    expect(routeClick).not.toHaveBeenCalled();
  });

  it("when clicked with metaKey, preventDefault should not be triggered", () => {
    const urlStore = store("/");
    const fooRoute = createRoute(
      "foo",
      {} as const,
      component("FooComponent", () => <div />)
    );

    const clickSpy = jasmine
      .createSpy("clickSpy", (evt: Event) => {
        expect(evt.defaultPrevented).toBe(false);
        evt.preventDefault();
      })
      .and.callThrough();
    const routeClick = jasmine.createSpy("clickSpy");

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
                onclick={routeClick}
              >
                link
              </fooRoute.Link>
            </div>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    const clickEvent = new MouseEvent("click", {
      cancelable: true,
      bubbles: true,
      metaKey: true,
    });

    (wrapper.find("a").getDOMNode() as HTMLElement).dispatchEvent(clickEvent);

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
    expect(routeClick).not.toHaveBeenCalled();
  });

  it("when clicked with shift, preventDefault should not be triggered", () => {
    const urlStore = store("/");
    const fooRoute = createRoute(
      "foo",
      {} as const,
      component("FooComponent", () => <div />)
    );

    const clickSpy = jasmine
      .createSpy("clickSpy", (evt: Event) => {
        expect(evt.defaultPrevented).toBe(false);
        evt.preventDefault();
      })
      .and.callThrough();
    const routeClick = jasmine.createSpy("clickSpy");

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
                onclick={routeClick}
              >
                link
              </fooRoute.Link>
            </div>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    const clickEvent = new MouseEvent("click", {
      cancelable: true,
      bubbles: true,
      shiftKey: true,
    });

    (wrapper.find("a").getDOMNode() as HTMLElement).dispatchEvent(clickEvent);

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
    expect(routeClick).not.toHaveBeenCalled();
  });
});
