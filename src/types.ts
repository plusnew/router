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

export type RouteToParameter<T extends { [1]: any }> = NamespaceToParameter<
  T[1]
>;
export type InferschemaToUrl<T> = T extends schema<any, infer R> ? R : never;
export type InferschemaFromUrl<T> = T extends schema<infer R, any> ? R : never;

export interface ParameterSpecificationTemplate {
  [ParameterName: string]: schema<any, any>;
}

export interface NamespaceTemplate {
  [Namespace: string]: ParameterSpecificationTemplate;
}

export type NamespaceToParameter<T extends ParameterSpecificationTemplate> = {
  -readonly [ParameterName in keyof T]: InferschemaFromUrl<T[ParameterName]>;
};

export type NamespaceToLinkParameter<T extends ParameterSpecificationTemplate> =
  {
    -readonly [ParameterName in keyof T]: InferschemaToUrl<T[ParameterName]>;
  };
