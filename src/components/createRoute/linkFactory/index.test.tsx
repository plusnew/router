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

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <fooRoute.Link
              parameter={{
                foo: {},
              }}
            >
              link
            </fooRoute.Link>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    const clickEvent = new MouseEvent("click", {
      cancelable: true,
    });

    (wrapper.find(".router__link").getDOMNode() as HTMLElement).dispatchEvent(
      clickEvent
    );

    expect(urlStore.getState()).toBe("/foo");
    expect(clickEvent.defaultPrevented).toBe(true);
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

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
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

    (wrapper.find(".router__link").getDOMNode() as HTMLElement).dispatchEvent(
      clickEvent
    );

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
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

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
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

    (wrapper.find(".router__link").getDOMNode() as HTMLElement).dispatchEvent(
      clickEvent
    );

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
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

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
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

    (wrapper.find(".router__link").getDOMNode() as HTMLElement).dispatchEvent(
      clickEvent
    );

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
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

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <div onclick={clickSpy}>
              <fooRoute.Link
                parameter={{
                  foo: {},
                }}
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

    (wrapper.find(".router__link").getDOMNode() as HTMLElement).dispatchEvent(
      clickEvent
    );

    expect(urlStore.getState()).toBe("/");
    expect(clickSpy).toHaveBeenCalled();
  });
});
