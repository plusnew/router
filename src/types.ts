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

export interface schema<T, U> {
  toUrl: (value: U) => toUrlResult;
  fromUrl: (
    tokenizer: Tokenizer,
    hasValues: boolean,
  ) => Generator<undefined, T, boolean>;
  isEqual: (a: Exclude<U, null>, b: Exclude<U, null>) => boolean;
  default?: U | null;
}

export type InferschemaToUrl<T> = T extends schema<any, infer R> ? R : never;
export type InferschemaFromUrl<T> = T extends schema<infer R, any> ? R : never;

export interface ParameterSpecificationTemplate {
  [ParameterName: string]: schema<any, any>;
}

export interface NamespaceTemplate {
  [Namespace: string]: ParameterSpecificationTemplate;
}

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
    [ParameterName in keyof T[NamespaceName]]: InferschemaToUrl<
      T[NamespaceName][ParameterName]
    >;
  };
};

export type NamespaceToParameter<T extends NamespaceTemplate> = {
  [NamespaceName in keyof T]: {
    [ParameterName in keyof T[NamespaceName]]: InferschemaFromUrl<
      T[NamespaceName][ParameterName]
    >;
  };
};

export type RouteToParameter<T extends Route<any>> = Parameters<
  Parameters<T["map"]>["1"]
>["0"]["parameter"];
