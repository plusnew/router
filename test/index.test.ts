import { expect } from "@esm-bundle/chai";
import { createRootRoute, serializer } from "../src";

describe("map", () => {
  it("root", () => {
    const rootRoute = createRootRoute({ foo: serializer.number() });
    const values = { "/": { foo: 3 } } as const;

    expect(values).to.eq(
      rootRoute.map(rootRoute.createPath(values), ({ parameter }) => parameter),
    );
  });
});
