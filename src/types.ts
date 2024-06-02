import type { TOKENS, Tokenizer } from "./tokenizer";

export type Token =
  | {
      [TokenName in keyof typeof TOKENS]: { type: TokenName };
    }[keyof typeof TOKENS]
  | {
      type: "TEXT";
      value: string;
    };

export type toUrlResult = null | string | { [parameter: string]: toUrlResult };

export type Serializer<T, U> = {
  toUrl: (value: U) => toUrlResult;
  fromUrl: (
    tokenizer: Tokenizer,
    hasValues: boolean,
  ) => Generator<undefined, T, boolean>;
  isDefault: (value: U) => boolean;
};

export type InferSerializerToUrl<T extends Serializer<any, any>> =
  T extends Serializer<any, infer R> ? R : never;
export type InferSerializerFromUrl<T extends Serializer<any, any>> =
  T extends Serializer<infer R, any> ? R : never;

export type ParameterSpecificationTemplate = {
  [ParameterName: string]: Serializer<any, any>;
};

export type NamespaceTemplate = {
  [Namespace: string]: ParameterSpecificationTemplate;
};

export interface Route<T extends NamespaceTemplate> {
  map: <U>(
    url: string,
    cb: (data: {
      parameter: NamespaceToParameter<T>;
      hasChildRouteActive: boolean;
    }) => U,
  ) => U | null;
  createChildRoute: <
    U extends string,
    V extends ParameterSpecificationTemplate,
  >(
    namespace: U,
    parameterSpec: V,
  ) => Route<T & { [namespace in U]: V }>;
  createPath: (parameter: NamespaceToLinkParameter<T>) => string;
}

export type NamespaceToLinkParameter<T extends NamespaceTemplate> = {
  [NamespaceName in keyof T]: {
    [ParameterName in keyof T[NamespaceName]]: InferSerializerToUrl<
      T[NamespaceName][ParameterName]
    >;
  };
};

export type NamespaceToParameter<T extends NamespaceTemplate> = {
  [NamespaceName in keyof T]: {
    [ParameterName in keyof T[NamespaceName]]: InferSerializerFromUrl<
      T[NamespaceName][ParameterName]
    >;
  };
};

export type RouteToParameter<T extends Route<any>> = Parameters<
  Parameters<T["map"]>["1"]
>["0"]["parameter"];
