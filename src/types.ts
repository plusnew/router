import type { TOKENS } from "tokenizer";

export type Token =
  | {
      [TokenName in keyof typeof TOKENS]: { type: TokenName };
    }[keyof typeof TOKENS]
  | {
      type: "TEXT";
      value: string;
    };

export type toUrlResult = string | { [parameter: string]: toUrlResult };

export type Serializer<T, U> = {
  toUrl: (value: T) => toUrlResult;
  fromUrl: (
    tokens: Token[],
    index: number | null,
  ) => Generator<number, { index: number; value: U }, number | null>;
};

export type InferSerializerToUrl<T extends Serializer<any, any>> =
  T extends Serializer<infer R, any> ? R : never;
export type InferSerializerFromUrl<T extends Serializer<any, any>> =
  T extends Serializer<any, infer R> ? R : never;

export type ParameterSpecificationTemplate = {
  [ParameterName: string]: Serializer<any, any>;
};

export type NamespaceTemplate = {
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
    parameterSpec: V,
  ) => Route<T & { U: V }>;
  createPath: (parameter: RouteToLinkParameter<T>) => string;
};

export type RouteToLinkParameter<T extends NamespaceTemplate> = {
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
