# plusnew-router [![Build Status](https://api.travis-ci.com/plusnew/router.svg?branch=master)](https://travis-ci.com/plusnew/router) [![Coverage Status](https://coveralls.io/repos/github/plusnew/router/badge.svg?branch=master)](https://coveralls.io/github/plusnew/router)

This router makes complete typesafety possible.
At compile and runtime the typesafety is guaranteed, for the Route-Components and also the Links.

```ts
import { createRootRoute, schema } from "@plusnew/router";

const rootRoute = createRootRoute(
  // Defines what parameter the route can have
  {
    size: schema.number({ default: 20 }), // This parameter is optional and has a default of 20
    sortOrder: schema.string({
      default: "desc",
      validate: (value) => value === "asc" || value === "desc", // Creates typesafety of only allowing the literals "asc" and "desc"
    }),
  },
);

const childRoute = rootRoute.createChildRoute("childRouteName", {
  nestedParameter: schema.object({
    id: schema.number(),
  }),
});

const url = childRoute.createPath({
  "/": {
    size: 20,
    sortOrder: null, // "asc" | "desc" | null
  },
  childRouteName: { nestedParameter: { id: 5 } },
});

document.body.innerHTML =
  rootRoute.map(url, ({ hasChildRouteActive, parameter }) =>
    hasChildRouteActive
      ? childRoute.map(url, ({ hasChildRouteActive, parameter }) =>
          hasChildRouteActive
            ? null
            : `${parameter["/"].size} + ${parameter.childRouteName.nestedParameter.id}`,
        )
      : `Welcome ${parameter["/"].size}`,
  ) ?? "not found";

```
