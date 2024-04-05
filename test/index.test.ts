import { expect } from "@esm-bundle/chai";
import type { RouteToParameter } from "../";
import { createRootRoute, serializer } from "../";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertType<T extends true>() {}

type IsEqual<CheckA, CheckB> =
  (<T>() => T extends CheckA ? 1 : 2) extends <T>() => T extends CheckB ? 1 : 2
    ? true
    : false;

describe("map", () => {
  describe("Path handling", () => {
    it("root", () => {
      const rootRoute = createRootRoute({ foo: serializer.number() });
      const values = { "/": { foo: 3 } } as const;

      assertType<
        IsEqual<
          RouteToParameter<typeof rootRoute>,
          {
            "/": { foo: number };
          }
        >
      >();

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

      const anotherChildRoute = rootRoute.createChildRoute(
        "anotherChildRoute",
        {
          bar: serializer.number(),
        },
      );

      expect(null).to.eql(
        anotherChildRoute.map(
          childRoute.createPath(values),
          (result) => result,
        ),
      );
    });
  });

  describe("serializer", () => {
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
});
