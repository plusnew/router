import type { parameterSpecToType } from "types/mapper";
import { serializer } from "../index";
import { createUrl, getParameter } from "./urlHandler";

describe("urlHandler", () => {
  it("routeName missmatch", () => {
    expect(() =>
      getParameter(
        [{ routeName: "bar", parameterSpec: {} }],
        createUrl([{ routeName: "foo", parameterSpec: {} }], {})
      )
    ).toThrow(new Error("Can not parse url /foo for wrong routeName bar"));
  });

  it("routeName for root", () => {
    getParameter(
      [{ routeName: "/", parameterSpec: {} }],
      createUrl([{ routeName: "/", parameterSpec: {} }], {})
    );
  });

  it("routeName for root, with parameter", () => {
    const spec = {
      foo: [serializer.string()],
    };

    const parameter = {
      "/": {
        foo: "baz",
      },
    };

    expect(
      getParameter<"/", typeof spec, {}>(
        [{ routeName: "/", parameterSpec: spec }],
        createUrl<"/", typeof spec, {}>(
          [{ routeName: "/", parameterSpec: spec }],
          parameter
        )
      )
    ).toEqual(parameter);
  });

  describe("missing parameter", () => {
    it("parseUrl", () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          "/routeName;foo=bar"
        )
      ).toThrow(
        new Error(
          "The url /routeName;foo=bar has incorrect parameter bar, it is not parsable as string"
        )
      );
    });

    it("createUrl", () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          {
            routeName: {
              foo: "fooValue",
            } as any,
          }
        )
      ).toThrow(
        new Error(
          "Could not create url for routeName, the property bar was not serializable as string with the value undefined"
        )
      );
    });
  });

  it("optional parameter", () => {
    const spec = {
      foo: [serializer.undefined(), serializer.string()],
      bar: [serializer.undefined(), serializer.string()],
    };

    const parameter = {
      routeName: {
        bar: "baz",
      },
    };

    expect(
      getParameter<"routeName", typeof spec, {}>(
        [{ routeName: "routeName", parameterSpec: spec }],
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          parameter
        )
      )
    ).toEqual(parameter);
  });

  describe("string", () => {
    it("basic", () => {
      const spec = {
        foo: [serializer.string()],
      };

      const parameter = {
        routeName: {
          foo: "fooValue",
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("empty String", () => {
      const spec = {
        foo: [serializer.string()],
      };

      const parameter = {
        routeName: {
          foo: "",
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("createUrl with invalid type", () => {
      const spec = {
        foo: [serializer.string()],
      };

      expect(() =>
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          {
            routeName: {
              foo: 42 as any,
            },
          }
        )
      ).toThrow(
        new Error(
          "Could not create url for routeName, the property foo was not serializable as string with the value 42"
        )
      );
    });

    it("basic with multiple", () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      const parameter = {
        routeName: {
          foo: "fooValue",
          bar: "barValue",
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("weird characters", () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      const parameter = {
        routeName: {
          foo: "foo&Value",
          bar: "barValue",
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and no value given", () => {
      const spec = {
        foo: [serializer.string(), serializer.undefined()],
      };

      const parameter = {
        routeName: {},
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and value given", () => {
      const spec = {
        foo: [serializer.undefined(), serializer.string()],
      };

      const parameter = {
        routeName: {
          foo: "string",
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with null serializer, and no value given", () => {
      const spec = {
        foo: [serializer.string(), serializer.null()],
      };

      const parameter = {
        routeName: {
          foo: null
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with null serializer, and value given", () => {
      const spec = {
        foo: [serializer.null(), serializer.string()],
      };

      const parameter = {
        routeName: {
          foo: "string",
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    describe("literal", () => {
      it("with correct value", () => {
        const spec = {
          param: [serializer.string("foo"), serializer.string("bar")],
        };

        const parameter = {
          routeName: {
            param: "foo" as const,
          },
        };

        expect(
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            createUrl<"routeName", typeof spec, {}>(
              [{ routeName: "routeName", parameterSpec: spec }],
              parameter
            )
          )
        ).toEqual(parameter);
      });

      it("with correct weird value", () => {
        const spec = {
          param: [serializer.string("foo&"), serializer.string("bar")],
        };

        const parameter = {
          routeName: {
            param: "foo&" as const,
          },
        };

        expect(
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            createUrl<"routeName", typeof spec, {}>(
              [{ routeName: "routeName", parameterSpec: spec }],
              parameter
            )
          )
        ).toEqual(parameter);
      });

      it("with incorrect value for createUrl", () => {
        const spec = {
          param: [serializer.string("foo"), serializer.string("bar")],
        };

        const parameter = {
          routeName: {
            param: "baz" as any,
          },
        };

        expect(() =>
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        ).toThrow(
          new Error(
            "Could not create url for routeName, the property param was not serializable as 'foo' | 'bar' with the value baz"
          )
        );
      });

      it("with incorrect value for parseUrl", () => {
        const spec = {
          param: [serializer.string("foo"), serializer.string("bar")],
        };

        expect(() =>
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            "/routeName;param=baz"
          )
        ).toThrow(
          new Error(
            "The url /routeName;param=baz has incorrect parameter param, it is not parsable as 'foo' | 'bar'"
          )
        );
      });
    });
  });

  describe("number", () => {
    it("basic", () => {
      const spec = {
        foo: [serializer.number()],
      };

      const parameter = {
        routeName: {
          foo: 23,
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and no value given", () => {
      const spec = {
        foo: [serializer.number(), serializer.undefined()],
      };

      const parameter = {
        routeName: {},
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and value given", () => {
      const spec = {
        foo: [serializer.undefined(), serializer.number()],
      };

      const parameter = {
        routeName: {
          foo: 34,
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("createUrl with invalid type", () => {
      const spec = {
        foo: [serializer.number()],
      };

      expect(() =>
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          {
            routeName: {
              foo: "fooValue" as any,
            },
          }
        )
      ).toThrow(
        new Error(
          "Could not create url for routeName, the property foo was not serializable as number with the value fooValue"
        )
      );
    });

    it("parseUrl with invalid type", () => {
      const spec = {
        foo: [serializer.number()],
      };

      expect(() =>
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          "/routeName;foo=invalid"
        )
      ).toThrow(
        new Error(
          "The url /routeName;foo=invalid has incorrect parameter foo, it is not parsable as number"
        )
      );
    });

    describe("literal", () => {
      it("with correct value", () => {
        const spec = {
          param: [serializer.number(2), serializer.number(3)],
        };

        const parameter = {
          routeName: {
            param: 2 as const,
          },
        };

        expect(
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            createUrl<"routeName", typeof spec, {}>(
              [{ routeName: "routeName", parameterSpec: spec }],
              parameter
            )
          )
        ).toEqual(parameter);
      });

      it("with incorrect value for createUrl", () => {
        const spec = {
          param: [serializer.number(2), serializer.number(3)],
        };

        const parameter = {
          routeName: {
            param: 5 as any,
          },
        };

        expect(() =>
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        ).toThrow(
          new Error(
            "Could not create url for routeName, the property param was not serializable as 2 | 3 with the value 5"
          )
        );
      });

      it("with incorrect value for parseUrl", () => {
        const spec = {
          param: [serializer.number(2), serializer.number(3)],
        };

        expect(() =>
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            "/routeName;param=5"
          )
        ).toThrow(
          new Error(
            "The url /routeName;param=5 has incorrect parameter param, it is not parsable as 2 | 3"
          )
        );
      });
    });
  });

  describe("date", () => {
    it("basic", () => {
      const spec = {
        foo: [serializer.date()],
      };

      const parameter = {
        routeName: {
          foo: new Date(),
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and no value given", () => {
      const spec = {
        foo: [serializer.date(), serializer.undefined()],
      };

      const parameter = {
        routeName: {},
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and value given", () => {
      const spec = {
        foo: [serializer.undefined(), serializer.date()],
      };

      const parameter = {
        routeName: {
          foo: new Date(),
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("createUrl with invalid type", () => {
      const spec = {
        foo: [serializer.date()],
      };

      expect(() =>
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          {
            routeName: {
              foo: "fooValue" as any,
            },
          }
        )
      ).toThrow(
        new Error(
          "Could not create url for routeName, the property foo was not serializable as date with the value fooValue"
        )
      );
    });

    it("parseUrl with invalid type", () => {
      const spec = {
        foo: [serializer.date()],
      };

      expect(() =>
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          "/routeName;foo=invalid"
        )
      ).toThrow(
        new Error(
          "The url /routeName;foo=invalid has incorrect parameter foo, it is not parsable as date"
        )
      );
    });
  });

  describe("boolean", () => {
    it("true", () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      const parameter = {
        routeName: {
          foo: true,
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("false", () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      const parameter = {
        routeName: {
          foo: false,
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and no value given", () => {
      const spec = {
        foo: [serializer.boolean(), serializer.undefined()],
      };

      const parameter = {
        routeName: {},
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and value given", () => {
      const spec = {
        foo: [serializer.undefined(), serializer.boolean()],
      };

      const parameter = {
        routeName: {
          foo: true,
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("createUrl with invalid type", () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          {
            routeName: {
              foo: "fooValue" as any,
            },
          }
        )
      ).toThrow(
        new Error(
          "Could not create url for routeName, the property foo was not serializable as boolean with the value fooValue"
        )
      );
    });

    it("parseUrl with invalid type", () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          "/routeName;foo=invalid"
        )
      ).toThrow(
        new Error(
          "The url /routeName;foo=invalid has incorrect parameter foo, it is not parsable as boolean"
        )
      );
    });

    describe("literal", () => {
      it("with correct value", () => {
        const spec = {
          param: [serializer.boolean(true)],
        };

        const parameter = {
          routeName: {
            param: true as const,
          },
        };

        expect(
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            createUrl<"routeName", typeof spec, {}>(
              [{ routeName: "routeName", parameterSpec: spec }],
              parameter
            )
          )
        ).toEqual(parameter);
      });

      it("with incorrect value for createUrl", () => {
        const spec = {
          param: [serializer.boolean(true)],
        };

        const parameter = {
          routeName: {
            param: false as any,
          },
        };

        expect(() =>
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        ).toThrow(
          new Error(
            "Could not create url for routeName, the property param was not serializable as true with the value false"
          )
        );
      });

      it("with incorrect value for createUrl", () => {
        const spec = {
          param: [serializer.boolean(false)],
        };

        const parameter = {
          routeName: {
            param: true as any,
          },
        };

        expect(() =>
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        ).toThrow(
          new Error(
            "Could not create url for routeName, the property param was not serializable as false with the value true"
          )
        );
      });

      it("with incorrect value for parseUrl", () => {
        const spec = {
          param: [serializer.boolean(true)],
        };

        expect(() =>
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            "/routeName;param=false"
          )
        ).toThrow(
          new Error(
            "The url /routeName;param=false has incorrect parameter param, it is not parsable as true"
          )
        );
      });

      it("with incorrect value for parseUrl", () => {
        const spec = {
          param: [serializer.boolean(false)],
        };

        expect(() =>
          getParameter<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            "/routeName;param=true"
          )
        ).toThrow(
          new Error(
            "The url /routeName;param=true has incorrect parameter param, it is not parsable as false"
          )
        );
      });
    });
  });

  describe("nested routes", () => {
    it("when a routechain with parent and child is given, then these should be parseable", () => {
      const rootSpec = {
        rootParam: [serializer.string()],
      };

      const childSpec = {
        childParam: [serializer.string()],
      };

      const parameter = {
        root: {
          rootParam: "foo",
        },
        child: {
          childParam: "bar",
        },
      };

      expect(
        getParameter<
          "root",
          typeof rootSpec,
          { child: parameterSpecToType<typeof childSpec> }
        >(
          [
            { routeName: "root", parameterSpec: rootSpec },
            { routeName: "child", parameterSpec: childSpec },
          ],
          createUrl<
            "root",
            typeof rootSpec,
            { child: parameterSpecToType<typeof childSpec> }
          >(
            [
              { routeName: "root", parameterSpec: rootSpec },
              { routeName: "child", parameterSpec: childSpec },
            ],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("when a routename with slash comes, that should work", () => {
      const rootSpec = {
        rootParam: [serializer.string()],
      };

      const childSpec = {
        childParam: [serializer.string()],
      };

      const parameter = {
        "root/name": {
          rootParam: "foo",
        },
        child: {
          childParam: "bar",
        },
      };

      expect(
        getParameter<
          "root/name",
          typeof rootSpec,
          { child: parameterSpecToType<typeof childSpec> }
        >(
          [
            { routeName: "root/name", parameterSpec: rootSpec },
            { routeName: "child", parameterSpec: childSpec },
          ],
          createUrl<
            "root/name",
            typeof rootSpec,
            { child: parameterSpecToType<typeof childSpec> }
          >(
            [
              { routeName: "root/name", parameterSpec: rootSpec },
              { routeName: "child", parameterSpec: childSpec },
            ],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("when a nested route is given, and asked for the parent parameter, that should give the parents parameter", () => {
      const rootSpec = {
        rootParam: [serializer.string()],
      };

      const childSpec = {
        childParam: [serializer.string()],
      };

      const parameter = {
        root: {
          rootParam: "foo",
        },
      };

      expect(
        getParameter<"root", typeof rootSpec, {}>(
          [{ routeName: "root", parameterSpec: rootSpec }],
          createUrl<
            "root",
            typeof rootSpec,
            { child: parameterSpecToType<typeof childSpec> }
          >(
            [
              { routeName: "root", parameterSpec: rootSpec },
              { routeName: "child", parameterSpec: childSpec },
            ],
            {
              ...parameter,
              child: {
                childParam: "bar",
              },
            }
          )
        )
      ).toEqual(parameter);
    });
  });

  describe("array", () => {
    it("basic", () => {
      const spec = {
        foo: [serializer.array([serializer.number(1), serializer.number()])],
      };

      const parameter = {
        routeName: {
          foo: [23],
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("empty array", () => {
      const spec = {
        foo: [serializer.array([serializer.number()])],
      };

      const parameter = {
        routeName: {
          foo: [],
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("mixed serializer array", () => {
      const spec = {
        foo: [serializer.array([serializer.number(), serializer.string()])],
      };

      const parameter = {
        routeName: {
          foo: ["fo,o", 5],
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and no value given", () => {
      const spec = {
        foo: [serializer.array([serializer.number()]), serializer.undefined()],
      };

      const parameter = {
        routeName: {},
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("with optional serializer, and value given", () => {
      const spec = {
        foo: [serializer.undefined(), serializer.array([serializer.number()])],
      };

      const parameter = {
        routeName: {
          foo: [34],
        },
      };

      expect(
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          createUrl<"routeName", typeof spec, {}>(
            [{ routeName: "routeName", parameterSpec: spec }],
            parameter
          )
        )
      ).toEqual(parameter);
    });

    it("createUrl with invalid type", () => {
      const spec = {
        foo: [serializer.array([serializer.number()])],
      };

      expect(() =>
        createUrl<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          {
            routeName: {
              foo: ["fooValue"] as any,
            },
          }
        )
      ).toThrow(
        new Error(
          "Could not create url for routeName, the property foo was not serializable as array with the value fooValue"
        )
      );
    });

    it("parseUrl with invalid type", () => {
      const spec = {
        foo: [serializer.array([serializer.number()])],
      };

      expect(() =>
        getParameter<"routeName", typeof spec, {}>(
          [{ routeName: "routeName", parameterSpec: spec }],
          "/routeName;foo=invalid"
        )
      ).toThrow(
        new Error(
          "The url /routeName;foo=invalid has incorrect parameter foo, it is not parsable as array"
        )
      );
    });
  });
});
