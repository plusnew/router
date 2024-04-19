import { expect } from "@esm-bundle/chai";
import { createRootRoute, serializer } from "../";
import { TOKENS } from "../src/tokenizer";

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
      const childRoute = rootRoute.createChildRoute("foo", {});
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

      expect(childRoute.map(rootRoute.createPath(inputValue), id)).to.eql(null);
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

    it("child", () => {
      const rootRoute = createRootRoute({});
      const childRoute = rootRoute.createChildRoute("child", {
        bar: serializer.number(),
      });
      const anotherChildRoute = rootRoute.createChildRoute(
        "anotherChildRoute",
        {
          bar: serializer.number(),
        },
      );
      const inputValue = { "/": {}, child: { bar: 2 } };
      const outputValue = childRoute.map(childRoute.createPath(inputValue), id);

      assertType<
        IsEqual<
          Parameters<typeof childRoute.createPath>[0],
          {
            // eslint-disable-next-line @typescript-eslint/ban-types
            "/": {};
            child: { bar: number };
          }
        >
      >();
      assertType<
        IsEqual<
          Exclude<typeof outputValue, null>["parameter"],
          {
            // eslint-disable-next-line @typescript-eslint/ban-types
            "/": {};
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

    it("validate", () => {
      const rootRoute = createRootRoute({
        foo: serializer.number({
          validate: function (value): value is 10 | 20 {
            return [10, 20].includes(value);
          },
        }),
      });

      const inputValue = { "/": { foo: 10 as const } };
      const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

      assertType<
        IsEqual<
          Parameters<typeof rootRoute.createPath>[0],
          {
            "/": { foo: 10 | 20 };
          }
        >
      >();
      assertType<
        IsEqual<
          Exclude<typeof outputValue, null>["parameter"],
          {
            "/": { foo: 10 | 20 };
          }
        >
      >();

      expect(outputValue).to.eql({
        parameter: { "/": { foo: 10 } },
        hasChildRouteActive: false,
      });

      expect(() => {
        rootRoute.createPath({
          "/": {
            foo: 30 as 20,
          },
        });
      }).to.throw();
    });

    describe("string", () => {
      it("standard", () => {
        const rootRoute = createRootRoute({
          foo: serializer.string(),
        });

        const inputValue = { "/": { foo: "bar" } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: string };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: string };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: inputValue,
          hasChildRouteActive: false,
        });
      });

      it("tokens", () => {
        const rootRoute = createRootRoute({
          foo: serializer.string(),
        });

        const inputValue = { "/": { foo: Object.values(TOKENS).join("") } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: string };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: string };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: inputValue,
          hasChildRouteActive: false,
        });
      });

      it("validate", () => {
        const rootRoute = createRootRoute({
          foo: serializer.string({
            validate: function (value): value is "bar" | "baz" {
              return ["bar", "baz"].includes(value);
            },
          }),
        });

        const inputValue = { "/": { foo: "bar" as const } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: "bar" | "baz" };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: "bar" | "baz" };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: { "/": { foo: "bar" } },
          hasChildRouteActive: false,
        });

        expect(() => {
          rootRoute.createPath({
            "/": {
              foo: "mep" as "bar",
            },
          });
        }).to.throw();
      });

      it("default", () => {
        const rootRoute = createRootRoute({
          foo: serializer.string({
            default: null,
          }),
        });

        const inputValue = { "/": { foo: null } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: string | null };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: string | null };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: { "/": { foo: null } },
          hasChildRouteActive: false,
        });
      });
    });

    describe("list", () => {
      it("standard", () => {
        const rootRoute = createRootRoute({
          foo: serializer.list({
            entities: serializer.number(),
          }),
        });

        const inputValue = { "/": { foo: [1, 2, 3] } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: number[] };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: number[] };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: { "/": { foo: [1, 2, 3] } },
          hasChildRouteActive: false,
        });
      });

      it("empty", () => {
        const rootRoute = createRootRoute({
          foo: serializer.list({
            entities: serializer.number(),
          }),
        });

        const inputValue = { "/": { foo: [] } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: number[] };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: number[] };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: { "/": { foo: [] } },
          hasChildRouteActive: false,
        });
      });

      it("object", () => {
        const rootRoute = createRootRoute({
          foo: serializer.list({
            entities: serializer.object({
              bar: serializer.string(),
              baz: serializer.number(),
            }),
          }),
        });

        const inputValue = {
          "/": {
            foo: [
              {
                bar: "mep",
                baz: 1,
              },
              {
                bar: "sup",
                baz: 2,
              },
            ],
          },
        };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: { bar: string; baz: number }[] };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: { bar: string; baz: number }[] };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: {
            "/": {
              foo: [
                {
                  bar: "mep",
                  baz: 1,
                },
                {
                  bar: "sup",
                  baz: 2,
                },
              ],
            },
          },
          hasChildRouteActive: false,
        });
      });
    });

    describe("boolean", () => {
      it("true", () => {
        const rootRoute = createRootRoute({
          foo: serializer.boolean(),
        });

        const inputValue = { "/": { foo: true } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: boolean };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: boolean };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: inputValue,
          hasChildRouteActive: false,
        });
      });

      it("false", () => {
        const rootRoute = createRootRoute({
          foo: serializer.boolean(),
        });

        const inputValue = { "/": { foo: false } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: boolean };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: boolean };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: inputValue,
          hasChildRouteActive: false,
        });
      });
    });

    describe("date", () => {
      it("standard", () => {
        const rootRoute = createRootRoute({
          foo: serializer.date(),
        });

        const now = new Date();
        const inputValue = { "/": { foo: now } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": { foo: Date };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": { foo: Date };
            }
          >
        >();

        expect(outputValue).to.eql({
          parameter: inputValue,
          hasChildRouteActive: false,
        });
      });
    });

    describe("enum", () => {
      it("standard", () => {
        const rootRoute = createRootRoute({
          foo: serializer.enum({
            enumerations: {
              bar: null,
              baz: serializer.number(),
            },
          }),
        });

        const inputValue = { "/": { foo: { type: "baz" as const, value: 2 } } };
        const outputValue = rootRoute.map(rootRoute.createPath(inputValue), id);

        assertType<
          IsEqual<
            Parameters<typeof rootRoute.createPath>[0],
            {
              "/": {
                foo:
                  | { type: "bar"; value: null }
                  | { type: "baz"; value: number };
              };
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              "/": {
                foo:
                  | { type: "bar"; value: null }
                  | { type: "baz"; value: number };
              };
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
});
