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
    describe("objects", () => {
      it("standard", () => {
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

      it("default", () => {
        const rootRoute = createRootRoute({
          foo: serializer.object({
            bar: serializer.number(),
            baz: serializer.number({ default: 10 }),
          }),
        });
        const inputValue = { "/": { foo: { bar: 2, baz: null } } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: { bar: number; baz: number | null } };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: { bar: number; baz: number } };
            }
          >
        >();
        expect(outputValue).to.eql({
          parameter: {
            "/": {
              foo: {
                bar: 2,
                baz: 10,
              },
            },
          },
          hasChildRouteActive: false,
        });
      });
    });

    describe("number", () => {
      it("default", () => {
        const rootRoute = createRootRoute({
          foo: serializer.number({ default: 10 }),
        });
        const alternativeDefault = createRootRoute({
          foo: serializer.number({ default: 20 }),
        });
        const inputValue = { "/": { foo: null } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: number | null };
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
          parameter: { "/": { foo: 10 } },
          hasChildRouteActive: false,
        });
        expect(
          alternativeDefault.map(
            rootRoute.createPath({ "/": { foo: 10 } }),
            id,
          ),
        ).to.eql({
          parameter: { "/": { foo: 20 } },
          hasChildRouteActive: false,
        });
      });
    });
  });
});
