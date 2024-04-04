import { expect } from "@esm-bundle/chai";
import { createRootRoute, serializer } from "../";

describe("map", () => {
  it("root", () => {
    const rootRoute = createRootRoute({ foo: serializer.number() });
    const values = { "/": { foo: 3 } } as const;

    expect({ parameter: values, hasChildRouteActive: false }).to.eql(
      rootRoute.map(rootRoute.createPath(values), (result) => result),
    );
  });

  it("child", () => {
    const rootRoute = createRootRoute({ foo: serializer.number() });
    const childRoute = rootRoute.createChildRoute("child", {
      bar: serializer.number(),
    });

    const values = { "/": { foo: 1 }, child: { bar: 2 } };

    expect({ parameter: values, hasChildRouteActive: false }).to.eql(
      childRoute.map(childRoute.createPath(values), (result) => result),
    );

    const anotherChildRoute = rootRoute.createChildRoute("anotherChildRoute", {
      bar: serializer.number(),
    });

    expect(null).to.eql(
      anotherChildRoute.map(childRoute.createPath(values), (result) => result),
    );
  });

  it("objects", () => {
    const rootRoute = createRootRoute({
      foo: serializer.object({
        bar: serializer.number(),
        baz: serializer.number(),
      }),
      mep: serializer.number(),
    });
    const values = { "/": { foo: { bar: 2, baz: 5 }, mep: 1 } } as const;

    expect({ parameter: values, hasChildRouteActive: false }).to.eql(
      rootRoute.map(rootRoute.createPath(values), (result) => result),
    );
  });
});
