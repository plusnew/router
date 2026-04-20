import { expect } from "chai";
import { mapPath, createPath, schema } from "../";
import { TOKENS } from "../src/tokenizer";

function assertType<T extends true>(): T {
  return true as T;
}

type IsEqual<CheckA, CheckB> =
  (<T>() => T extends CheckA ? 1 : 2) extends <T>() => T extends CheckB ? 1 : 2
    ? true
    : false;

describe("map", () => {
  describe("Path handling", () => {
    it("basic", () => {
      const route = ["name", { foo: schema.number() }] as const;
      // type foo = RouteToParameter<typeof route>;
      const path = createPath(...route, { foo: 2 }); // "/name;foo=2"
      const mapResult = mapPath(...route, path, (parameter, rest) => ({
        parameter,
        rest,
      }));
      expect(mapResult).to.eql({ rest: null, parameter: { foo: 2 } });
    });

    it("name mismatch", () => {
      const route = ["name", { foo: schema.number() }] as const;
      const path = createPath(...route, { foo: 2 }); // "/name;foo=2"
      const mapResult = mapPath(
        "anothername",
        route[1],
        path,
        (parameter, rest) => ({
          parameter,
          rest,
        }),
      );
      expect(mapResult).to.eql(null);
    });

    it("parameter mismatch", () => {
      const route = ["name", { foo: schema.number() }] as const;
      const path = createPath(...route, { foo: 2 }); // "/name;foo=2"

      const mapResult = mapPath(route[0], {}, path, (parameter, rest) => ({
        parameter,
        rest,
      }));
      expect(mapResult).to.eql(null);
    });

    it("nested", () => {
      const route = ["name", { foo: schema.number() }] as const;
      const nestedRoute = ["anotherName", { bar: schema.number() }] as const;
      const path = `${createPath(...route, { foo: 2 })}${createPath(...nestedRoute, { bar: 3 })}`; // "/name;foo=2/anotherName;bar=3"

      const mapResult = mapPath(
        ...route,
        path,
        (
          parameter, // {foo: 2}
          rest, // "/anotherName;bar=3"
        ) =>
          rest === null
            ? null
            : mapPath(...nestedRoute, rest, (nestedParameter, rest) => ({
                root: parameter,
                nested: nestedParameter,
                rest,
              })),
      );
      expect(mapResult).to.eql({
        rest: null,
        root: { foo: 2 },
        nested: { bar: 3 },
      });
    });

    //   it("root", () => {
    //     const rootRoute = [({ foo: schema.number() })] as const;
    //     const childRoute = rootRoute.createChildRoute("foo", {});
    //     const inputValue = {  foo: 3  };
    //     const outputValue = mapPath(...rootRoute,createPath(...rootRoute,inputValue), id);
    //     assertType<
    //       IsEqual<
    //         Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
    //         {
    //            foo: number ;
    //         }
    //       >
    //     >();
    //     assertType<
    //       IsEqual<
    //         Exclude<typeof outputValue, null>["parameter"],
    //         {
    //            foo: number ;
    //         }
    //       >
    //     >();
    //     expect(outputValue).to.eql({
    //       parameter: inputValue,
    //       hasChildRouteActive: true,
    //     });
    //     expect(childRoute.map(createPath(...rootRoute,inputValue), id)).to.eql(null);
    //   });
    //   it("optional handling", () => {
    //     const rootRoute = [({
    //       foo: schema.number(),
    //       bar: schema.number({ default: 23 }),
    //     })] as const;
    //     const inputValue = {  foo: 3, bar: null, baz: null  };
    //     const outputValue = mapPath(...rootRoute,createPath(...rootRoute,inputValue), id);
    //     assertType<
    //       IsEqual<
    //         Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
    //         {
    //            foo: number; bar: number | null ;
    //         }
    //       >
    //     >();
    //     assertType<
    //       IsEqual<
    //         Exclude<typeof outputValue, null>["parameter"],
    //         {
    //            foo: number; bar: number ;
    //         }
    //       >
    //     >();
    //     expect(outputValue).to.eql({
    //       parameter: {  foo: 3, bar: 23  },
    //       hasChildRouteActive: false,
    //     });
    //   });
    //   it("child handling", () => {
    //     const rootRoute = [({})] as const;
    //     const childRoute = rootRoute.createChildRoute("foo", {});
    //     const inputValue = { , foo: {} };
    //     const outputValue = mapPath(...rootRoute,childRoute.createPath(inputValue), id);
    //     assertType<
    //       IsEqual<
    //         Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
    //         {
    //           // eslint-disable-next-line @typescript-eslint/ban-types
    //           ;
    //         }
    //       >
    //     >();
    //     assertType<
    //       IsEqual<
    //         Exclude<typeof outputValue, null>["parameter"],
    //         {
    //           // eslint-disable-next-line @typescript-eslint/ban-types
    //           ;
    //         }
    //       >
    //     >();
    //     expect(outputValue).to.eql({
    //       parameter: {  },
    //       hasChildRouteActive: true,
    //     });
    //     expect(childRoute.map(createPath(...rootRoute,inputValue), id)).to.eql(null);
    //   });
    //   it("custom path prefix", () => {
    //     const rootRoute = [("/foo", { foo: schema.number() })] as const;
    //     const rootRouteWithoutPrefix = [({
    //       foo: schema.number(),
    //     })] as const;
    //     const childRoute = rootRoute.createChildRoute("foo", {});
    //     const inputValue = {  foo: 3  };
    //     const outputValue = mapPath(...rootRoute,createPath(...rootRoute,inputValue), id);
    //     assertType<
    //       IsEqual<
    //         Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
    //         {
    //            foo: number ;
    //         }
    //       >
    //     >();
    //     assertType<
    //       IsEqual<
    //         Exclude<typeof outputValue, null>["parameter"],
    //         {
    //            foo: number ;
    //         }
    //       >
    //     >();
    //     expect(outputValue).to.eql({
    //       parameter: inputValue,
    //       hasChildRouteActive: false,
    //     });
    //     expect(childRoute.map(createPath(...rootRoute,inputValue), id)).to.eql(null);
    //     expect(
    //       rootRouteWithoutPrefix.map(createPath(...rootRoute,inputValue), id),
    //     ).to.eql(null);
    //   });
    //   it("child", () => {
    //     const rootRoute = [({ foo: schema.number() })] as const;
    //     const childRoute = rootRoute.createChildRoute("child", {
    //       bar: schema.number(),
    //     });
    //     const anotherChildRoute = rootRoute.createChildRoute(
    //       "anotherChildRoute",
    //       {
    //         bar: schema.number(),
    //       },
    //     );
    //     const inputValue = {  foo: 1 , child: { bar: 2 } };
    //     const outputValue = childRoute.map(childRoute.createPath(inputValue), id);
    //     assertType<
    //       IsEqual<
    //         Parameters<typeof childRoute.createPath>[0],
    //         {
    //            foo: number ;
    //           child: { bar: number };
    //         }
    //       >
    //     >();
    //     assertType<
    //       IsEqual<
    //         Exclude<typeof outputValue, null>["parameter"],
    //         {
    //            foo: number ;
    //           child: { bar: number };
    //         }
    //       >
    //     >();
    //     expect(outputValue).to.eql({
    //       parameter: inputValue,
    //       hasChildRouteActive: false,
    //     });
    //     expect(
    //       anotherChildRoute.map(
    //         childRoute.createPath(inputValue),
    //         (result) => result,
    //       ),
    //     ).to.eql(null);
    //   });
    //   it("child", () => {
    //     const rootRoute = [({})] as const;
    //     const childRoute = rootRoute.createChildRoute("child", {
    //       bar: schema.number(),
    //     });
    //     const anotherChildRoute = rootRoute.createChildRoute(
    //       "anotherChildRoute",
    //       {
    //         bar: schema.number(),
    //       },
    //     );
    //     const inputValue = { , child: { bar: 2 } };
    //     const outputValue = childRoute.map(childRoute.createPath(inputValue), id);
    //     assertType<
    //       IsEqual<
    //         Parameters<typeof childRoute.createPath>[0],
    //         {
    //           // eslint-disable-next-line @typescript-eslint/ban-types
    //           ;
    //           child: { bar: number };
    //         }
    //       >
    //     >();
    //     assertType<
    //       IsEqual<
    //         Exclude<typeof outputValue, null>["parameter"],
    //         {
    //           // eslint-disable-next-line @typescript-eslint/ban-types
    //           ;
    //           child: { bar: number };
    //         }
    //       >
    //     >();
    //     expect(outputValue).to.eql({
    //       parameter: inputValue,
    //       hasChildRouteActive: false,
    //     });
    //     expect(
    //       anotherChildRoute.map(
    //         childRoute.createPath(inputValue),
    //         (result) => result,
    //       ),
    //     ).to.eql(null);
    //   });
    //   it("to few parameters", () => {
    //     const rootRoute = [({ foo: schema.number() })] as const;
    //     const anotherRootRoute = [({})] as const;
    //     expect(
    //       mapPath(...rootRoute,anotherRootRoute.createPath({  }), id),
    //     ).to.eql(null);
    //   });
    //   it("to many parameters", () => {
    //     const rootRoute = [({})] as const;
    //     const anotherRootRoute = [({ foo: schema.number() })] as const;
    //     expect(
    //       mapPath(...rootRoute,anotherRootRoute.createPath({  foo: 1  }), id),
    //     ).to.eql(null);
    //   });
    // });
    describe("schema", () => {
      describe("objects", () => {
        it("standard", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.object({
                bar: schema.number(),
                baz: schema.number(),
              }),
              mep: schema.number(),
            },
          ] as const;

          const inputValue = { foo: { bar: 2, baz: 5 }, mep: 1 };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),
            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );

          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: { bar: number; baz: number };
                mep: number;
              }
            >
          >();

          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: { bar: number; baz: number };
                mep: number;
              }
            >
          >();

          expect(outputValue).to.eql({
            parameter: inputValue,
            hasChildRouteActive: false,
          });
        });

        it("default", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.object({
                bar: schema.number(),
                baz: schema.number({ default: 10 }),
              }),
            },
          ] as const;
          const inputValue = { foo: { bar: 2, baz: null } };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: { bar: number; baz: number | null };
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: { bar: number; baz: number };
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: {
              foo: {
                bar: 2,
                baz: 10,
              },
            },
            hasChildRouteActive: false,
          });
        });

        it("all-default", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.object({
                bar: schema.number({ default: 5 }),
                baz: schema.number({ default: 10 }),
              }),
            },
          ] as const;
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, null),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              null | {
                foo: null | { bar: number | null; baz: number | null };
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: { bar: number; baz: number };
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: {
              foo: {
                bar: 5,
                baz: 10,
              },
            },
            hasChildRouteActive: false,
          });
        });
      });
      describe("number", () => {
        it("default", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.number({ default: 10 }),
            },
          ] as const;
          const alternativeDefault = [
            "root",
            {
              foo: schema.number({ default: 20 }),
            },
          ] as const;
          const inputValue = { foo: null };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              null | {
                foo: number | null;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: number;
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: { foo: 10 },
            hasChildRouteActive: false,
          });
          expect(
            mapPath(
              ...alternativeDefault,
              createPath(...rootRoute, { foo: 10 }),
              (parameter, rest) => ({
                parameter,
                hasChildRouteActive: rest !== null,
              }),
            ),
          ).to.eql({
            parameter: { foo: 20 },
            hasChildRouteActive: false,
          });
        });
      });
      it("validate", () => {
        const rootRoute = [
          "root",
          {
            foo: schema.number({
              validate: function (value): value is 10 | 20 {
                return [10, 20].includes(value);
              },
            }),
          },
        ] as const;
        const inputValue = { foo: 10 as const };
        const outputValue = mapPath(
          ...rootRoute,
          createPath(...rootRoute, inputValue),

          (parameter, rest) => ({
            parameter,
            hasChildRouteActive: rest !== null,
          }),
        );
        assertType<
          IsEqual<
            Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
            {
              foo: 10 | 20;
            }
          >
        >();
        assertType<
          IsEqual<
            Exclude<typeof outputValue, null>["parameter"],
            {
              foo: 10 | 20;
            }
          >
        >();
        expect(outputValue).to.eql({
          parameter: { foo: 10 },
          hasChildRouteActive: false,
        });
        expect(() => {
          createPath(...rootRoute, {
            foo: 30 as 20,
          });
        }).to.throw();
      });
      describe("string", () => {
        it("standard", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.string(),
            },
          ] as const;
          const inputValue = { foo: "bar" };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: string;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: string;
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: inputValue,
            hasChildRouteActive: false,
          });
        });
        it("tokens", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.string(),
            },
          ] as const;
          const inputValue = { foo: Object.values(TOKENS).join("") };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: string;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: string;
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: inputValue,
            hasChildRouteActive: false,
          });
        });
        it("validate", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.string({
                validate: function (value): value is "bar" | "baz" {
                  return ["bar", "baz"].includes(value);
                },
              }),
            },
          ] as const;
          const inputValue = { foo: "bar" as const };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: "bar" | "baz";
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: "bar" | "baz";
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: { foo: "bar" },
            hasChildRouteActive: false,
          });
          expect(() => {
            createPath(...rootRoute, {
              foo: "mep" as "bar",
            });
          }).to.throw();
        });
        it("default", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.string({
                default: null,
              }),
            },
          ] as const;
          const inputValue = { foo: null };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              null | {
                foo: string | null;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: string | null;
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: { foo: null },
            hasChildRouteActive: false,
          });
        });
        it("empty", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.string({
                default: "",
              }),
            },
          ] as const;
          const inputValue = { foo: "" };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              null | {
                foo: string | null;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: string;
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: { foo: "" },
            hasChildRouteActive: false,
          });
        });
      });
      describe("list", () => {
        it("standard", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.list({
                entities: schema.number(),
              }),
            },
          ] as const;
          const inputValue = { foo: [1, 2, 3] };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: number[];
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: number[];
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: { foo: [1, 2, 3] },
            hasChildRouteActive: false,
          });
        });
        it("empty", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.list({
                entities: schema.number(),
              }),
            },
          ] as const;
          const inputValue = { foo: [] };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: number[];
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: number[];
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: { foo: [] },
            hasChildRouteActive: false,
          });
        });
        describe("default", () => {
          it("empty", () => {
            const rootRoute = [
              "root",
              {
                foo: schema.list({
                  default: [],
                  entities: schema.number(),
                }),
              },
            ] as const;
            const alternativeDefault = [
              "root",
              {
                foo: schema.list({
                  default: [1],
                  entities: schema.number(),
                }),
              },
            ] as const;
            const inputValue = { foo: [] };
            const outputValue = mapPath(
              ...rootRoute,
              createPath(...rootRoute, inputValue),

              (parameter, rest) => ({
                parameter,
                hasChildRouteActive: rest !== null,
              }),
            );
            assertType<
              IsEqual<
                Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
                null | {
                  foo: number[] | null;
                }
              >
            >();
            assertType<
              IsEqual<
                Exclude<typeof outputValue, null>["parameter"],
                {
                  foo: number[];
                }
              >
            >();
            expect(outputValue).to.eql({
              parameter: { foo: [] },
              hasChildRouteActive: false,
            });
            expect(
              mapPath(
                ...alternativeDefault,
                createPath(...rootRoute, { foo: [] }),

                (parameter, rest) => ({
                  parameter,
                  hasChildRouteActive: rest !== null,
                }),
              ),
            ).to.eql({
              parameter: { foo: [1] },
              hasChildRouteActive: false,
            });
            expect(
              mapPath(
                ...alternativeDefault,
                createPath(...rootRoute, { foo: null }),

                (parameter, rest) => ({
                  parameter,
                  hasChildRouteActive: rest !== null,
                }),
              ),
            ).to.eql({
              parameter: { foo: [1] },
              hasChildRouteActive: false,
            });
          });
          it("empty", () => {
            const rootRoute = [
              "root",
              {
                foo: schema.list({
                  default: [1],
                  entities: schema.number(),
                }),
              },
            ] as const;
            const alternativeDefault = [
              "root",
              {
                foo: schema.list({
                  default: [2],
                  entities: schema.number(),
                }),
              },
            ] as const;
            const inputValue = { foo: [] };
            const outputValue = mapPath(
              ...rootRoute,
              createPath(...rootRoute, inputValue),

              (parameter, rest) => ({
                parameter,
                hasChildRouteActive: rest !== null,
              }),
            );
            assertType<
              IsEqual<
                Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
                null | {
                  foo: number[] | null;
                }
              >
            >();
            assertType<
              IsEqual<
                Exclude<typeof outputValue, null>["parameter"],
                {
                  foo: number[];
                }
              >
            >();
            expect(outputValue).to.eql({
              parameter: { foo: [] },
              hasChildRouteActive: false,
            });
            expect(
              mapPath(
                ...alternativeDefault,
                createPath(...rootRoute, { foo: [1] }),
                (parameter, rest) => ({
                  parameter,
                  hasChildRouteActive: rest !== null,
                }),
              ),
            ).to.eql({
              parameter: { foo: [2] },
              hasChildRouteActive: false,
            });
          });
        });
        it("object", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.list({
                entities: schema.object({
                  bar: schema.string(),
                  baz: schema.number(),
                }),
              }),
            },
          ] as const;
          const inputValue = {
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
          };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: { bar: string; baz: number }[];
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: { bar: string; baz: number }[];
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: {
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
            hasChildRouteActive: false,
          });
        });
      });
      describe("boolean", () => {
        it("true", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.boolean(),
            },
          ] as const;
          const inputValue = { foo: true };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: boolean;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: boolean;
              }
            >
          >();
          expect(outputValue).to.eql({
            parameter: inputValue,
            hasChildRouteActive: false,
          });
        });
        it("false", () => {
          const rootRoute = [
            "root",
            {
              foo: schema.boolean(),
            },
          ] as const;
          const inputValue = { foo: false };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: boolean;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: boolean;
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
          const rootRoute = [
            "root",
            {
              foo: schema.date(),
            },
          ] as const;
          const now = new Date();
          const inputValue = { foo: now };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),

            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo: Date;
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo: Date;
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
          const rootRoute = [
            "root",
            {
              foo: schema.enum({
                enumerations: {
                  bar: null,
                  baz: schema.number(),
                },
              }),
            },
          ] as const;
          const inputValue = {
            foo: { type: "baz" as const, value: 2 },
          };
          const outputValue = mapPath(
            ...rootRoute,
            createPath(...rootRoute, inputValue),
            (parameter, rest) => ({
              parameter,
              hasChildRouteActive: rest !== null,
            }),
          );
          assertType<
            IsEqual<
              Parameters<typeof createPath<(typeof rootRoute)[1]>>[2],
              {
                foo:
                  | { type: "bar"; value: null }
                  | { type: "baz"; value: number };
              }
            >
          >();
          assertType<
            IsEqual<
              Exclude<typeof outputValue, null>["parameter"],
              {
                foo:
                  | { type: "bar"; value: null }
                  | { type: "baz"; value: number };
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
});
