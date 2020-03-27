import { context, store } from "@plusnew/core";
import type { routeContainer } from "../types/route";

type mountRouteAction = {
  type: "mount";
  payload: routeContainer<any, any, any>[];
};

type unmountRouteAction = {
  type: "unmount";
  payload: routeContainer<any, any, any>[];
};

type actions = mountRouteAction | unmountRouteAction;

export const storeFactory = () =>
  store<routeContainer<any, any, any>[][], actions>(
    [],
    (currentRoutes, action) => {
      if (action.type === "mount") {
        return [...currentRoutes, action.payload];
      }
      if (action.type === "unmount") {
        return currentRoutes.filter(
          (currentRoute) => currentRoute !== action.payload
        );
      }
      throw new Error("No such action");
    }
  );

export default context<routeContainer<any, any, any>[][], actions>();
