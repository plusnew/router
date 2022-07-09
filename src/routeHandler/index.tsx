type Route<T> = {
  parseUrl: (
    url: string
  ) =>
    | { isActive: true; isActiveAsParent: false; parameter: T }
    | { isActive: false; isActiveAsParent: true; parameter: T }
    | { isActive: false; isActiveAsParent: false };
};

export const createRoute = function <T extends string, U>(
  _namespace: T,
  _parameterSpec: U
): Route<{ [namespace in T]: U }> {
  return {
    parseUrl: () => ({ isActive: false, isActiveAsParent: false }),
  };
};
