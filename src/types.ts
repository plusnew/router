import type { TOKENS } from "tokenizer";

export type Token =
  | {
      [TokenName in keyof typeof TOKENS]: { type: TokenName };
    }[keyof typeof TOKENS]
  | {
      type: "TEXT";
    };

export type Serializer<T, U> = {
  toUrl: (value: T) => string;
  fromUrl: (tokens: Token[]) => U;
};

export type ParameterSpecificationTemplate = {
  [ParameterName: string]: Serializer<any, any>;
};

type NamespaceTemplate = {
  [Namespace: string]: ParameterSpecificationTemplate;
};

export type Route<T extends NamespaceTemplate> = {
  map: <U>(
    url: string,
    cb: (data: {
      parameter: RouteToParameter<T>;
      hasChildRouteActive: boolean;
    }) => U,
  ) => U | null;
  createChildRoute: <
    U extends string,
    V extends ParameterSpecificationTemplate,
  >(
    namespace: U,
    parameter: V,
  ) => Route<T & { U: V }>;
  createPath: (parameter: RouteToLinkParameter<T>) => string;
};

type RouteToLinkParameter<T extends NamespaceTemplate> = {
  [NamespaceName in keyof T]: {
    [ParameterName in keyof T[NamespaceName]]: Parameters<
      T[NamespaceName][ParameterName]["toUrl"]
    >["0"];
  };
};

export type RouteToParameter<T extends NamespaceTemplate> = {
  [NamespaceName in keyof T]: {
    [ParameterName in keyof T[NamespaceName]]: ReturnType<
      T[NamespaceName][ParameterName]["fromUrl"]
    >;
  };
};
