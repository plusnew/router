type Route = {
  parseUrl: (
    url: string
  ) =>
    | { isActive: true; isActiveAsParent: false; parameter: any }
    | { isActive: false; isActiveAsParent: true; parameter: any }
    | { isActive: false; isActiveAsParent: false };
};

export const createRoute = (_namespace: string, _parameterSpec: any): Route => {
  return {
    parseUrl: () => ({isActive: false, isActiveAsParent: false})
  };
};
