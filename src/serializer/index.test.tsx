import { createRoute, serializer } from "..";
import { expect } from "@esm-bundle/chai";

describe("serializer", () => {
  describe("string", () => {
    it("base", () => {
      const route = createRoute("test", {
        foo: [serializer.string()],
      });

      const parameter = {
        test: {
          foo: "bar",
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("literal", () => {
      const route = createRoute("test", {
        foo: [serializer.string("bar")],
      });

      const parameter = {
        test: {
          foo: "bar",
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("optional", () => {
      const route = createRoute("test", {
        foo: [serializer.string(), serializer.null()],
      });

      const parameter = {
        test: {
          foo: null,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });
  });

  describe("number", () => {
    it("base", () => {
      const route = createRoute("test", {
        foo: [serializer.number()],
      });

      const parameter = {
        test: {
          foo: 1,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("literal", () => {
      const route = createRoute("test", {
        foo: [serializer.number(1)],
      });

      const parameter = {
        test: {
          foo: 1,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("optional", () => {
      const route = createRoute("test", {
        foo: [serializer.number(), serializer.null()],
      });

      const parameter = {
        test: {
          foo: null,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    describe("date", () => {
      it("base", () => {
        const route = createRoute("test", {
          foo: [serializer.date()],
        });

        const parameter = {
          test: {
            foo: new Date(),
          },
        } as const;

        expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
          route.parseUrl(route.createUrl(parameter))
        );
      });

      it("optional", () => {
        const route = createRoute("test", {
          foo: [serializer.date(), serializer.null()],
        });

        const parameter = {
          test: {
            foo: null,
          },
        } as const;

        expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
          route.parseUrl(route.createUrl(parameter))
        );
      });
    });
  });

  describe("boolean", () => {
    it("base", () => {
      const route = createRoute("test", {
        foo: [serializer.boolean()],
      });

      const parameter = {
        test: {
          foo: true,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("literal", () => {
      const route = createRoute("test", {
        foo: [serializer.boolean(false)],
      });

      const parameter = {
        test: {
          foo: false,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("optional", () => {
      const route = createRoute("test", {
        foo: [serializer.boolean(), serializer.null()],
      });

      const parameter = {
        test: {
          foo: null,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });
  });

  describe("number", () => {
    it("base", () => {
      const route = createRoute("test", {
        foo: [serializer.number()],
      });

      const parameter = {
        test: {
          foo: 1,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("literal", () => {
      const route = createRoute("test", {
        foo: [serializer.number(1)],
      });

      const parameter = {
        test: {
          foo: 1,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("optional", () => {
      const route = createRoute("test", {
        foo: [serializer.number(), serializer.null()],
      });

      const parameter = {
        test: {
          foo: null,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    describe("date", () => {
      it("base", () => {
        const route = createRoute("test", {
          foo: [serializer.date()],
        });

        const parameter = {
          test: {
            foo: new Date(),
          },
        } as const;

        expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
          route.parseUrl(route.createUrl(parameter))
        );
      });

      it("optional", () => {
        const route = createRoute("test", {
          foo: [serializer.date(), serializer.null()],
        });

        const parameter = {
          test: {
            foo: null,
          },
        } as const;

        expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
          route.parseUrl(route.createUrl(parameter))
        );
      });
    });
  });

  describe("array", () => {
    it("base", () => {
      const route = createRoute("test", {
        foo: [serializer.array([serializer.string()])],
      });

      const parameter = {
        test: {
          foo: ["bar"],
        },
      };

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });

    it("optional", () => {
      const route = createRoute("test", {
        foo: [serializer.array([serializer.string()]), serializer.null()],
      });

      const parameter = {
        test: {
          foo: null,
        },
      } as const;

      expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
        route.parseUrl(route.createUrl(parameter))
      );
    });
  });

  describe("order", () => {
    const route = createRoute("test", {
      foo: [serializer.string()],
      bar: [serializer.null()],
      baz: [serializer.string()],
    });

    const parameter = {
      test: {
        bar: null,
        baz: "first",
        foo: "second",
      },
    } as const;

    const result = route.parseUrl(route.createUrl(parameter));

    expect({ isActive: true, isActiveAsParent: false, parameter }).to.eql(
      result
    );
    expect(Object.keys(parameter.test)).to.eql(
      result.isActive && Object.keys(result.parameter.test)
    );
  });
});
