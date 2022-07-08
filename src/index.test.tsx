import plusnew, { store } from "@plusnew/core";
import "@plusnew/driver-dom";
import { expect } from "@esm-bundle/chai";
import enzymeAdapterPlusnew, { mount } from "@plusnew/enzyme-adapter";
import { configure } from "enzyme";
import { StaticProvider, UrlConsumer, createRoute, serializer } from "./index";

configure({ adapter: new enzymeAdapterPlusnew() });

describe("api", () => {
  it("does createroute work as expected", () => {
    const urlStore = store("/rootPath;parentParam=foo");

    const rootRoute = createRoute("rootPath", {
      parentParam: [serializer.string()],
    } as const);

    const wrapper = mount(
      <urlStore.Observer>
        {(urlState) => (
          <StaticProvider state={urlState} dispatch={urlStore.dispatch}>
            <UrlConsumer>
              {(urlState) => (
                <div>{rootRoute.parseUrl(urlState).isActive && "foo"}</div>
              )}
            </UrlConsumer>
          </StaticProvider>
        )}
      </urlStore.Observer>
    );

    expect(wrapper.contains(<div>foo</div>)).to.equal(true);

    wrapper.unmount();
  });
});
