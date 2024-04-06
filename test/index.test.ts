import { expect } from "@esm-bundle/chai";
import { createRootRoute, serializer } from "../";

function assertType<T extends true>(): T {
  return true as T;
}

function id<T>(value: T) {
  return value;
}

type IsEqual<CheckA, CheckB> =
  (<T>() => T extends CheckA ? 1 : 2) extends <T>() => T extends CheckB ? 1 : 2
    ? true
    : false;

describe("map", () => {
  describe("Path handling", () => {
    it("root", () => {
      const rootRoute = createRootRoute({ foo: serializer.number() });
      const inputValue = { "/": { foo: 3 } };

      const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

      assertType<
        IsEqual<
          Parameters<typeof rootRoute.createPath>[0],
          {
            "/": { foo: number };
          }
        >
      >();
      assertType<
        IsEqual<
          Exclude<typeof outputValue, null>["parameter"],
          {
            "/": { foo: number };
          }
        >
      >();
      expect(outputValue).to.eql({
        parameter: inputValue,
        hasChildRouteActive: false,
      });
    });

    it("child", () => {
      const rootRoute = createRootRoute({ foo: serializer.number() });
      const childRoute = rootRoute.createChildRoute("child", {
        bar: serializer.number(),
      });
      const anotherChildRoute = rootRoute.createChildRoute(
        "anotherChildRoute",
        {
          bar: serializer.number(),
        },
      );
      const inputValue = { "/": { foo: 1 }, child: { bar: 2 } };
      const outputValue = childRoute.map(childRoute.createPath(inputValue), id);

      assertType<
        IsEqual<
          Parameters<typeof childRoute.createPath>[0],
          {
            "/": { foo: number };
            child: { bar: number };
          }
        >
      >();
      assertType<
        IsEqual<
          Exclude<typeof outputValue, null>["parameter"],
          {
            "/": { foo: number };
            child: { bar: number };
          }
        >
      >();
      expect(outputValue).to.eql({
        parameter: inputValue,
        hasChildRouteActive: false,
      });
      expect(
        anotherChildRoute.map(
          childRoute.createPath(inputValue),
          (result) => result,
        ),
      ).to.eql(null);
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
      const inputValue = { "/": { foo: { bar: 2, baz: 5 }, mep: 1 } };
      const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

      assertType<
        IsEqual<
          Parameters<typeof rootRoute.createPath>[0],
          {
            "/": { foo: { bar: number; baz: number }; mep: number };
          }
        >
      >();
      assertType<
        IsEqual<
          Exclude<typeof outputValue, null>["parameter"],
          {
            "/": { foo: { bar: number; baz: number }; mep: number };
          }
        >
      >();
      expect(outputValue).to.eql({
        parameter: inputValue,
        hasChildRouteActive: false,
      });
    });
  });
});
