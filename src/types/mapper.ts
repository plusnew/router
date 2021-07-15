import type { ComponentContainer } from "@plusnew/core";

type serializerToUrlResult =
  | { valid: false }
  | { valid: true; value: string | undefined };
type serializerFromUrlResult<T> = { valid: false } | { valid: true; value: T };

export type serializer<T> = {
  displayName: string;
  toUrl: (from: T) => serializerToUrlResult;
  fromUrl: (from: string | undefined) => serializerFromUrlResult<T>;
};

export type parameterSpecTemplate = {
  [paramName: string]: readonly serializer<any>[];
};

type getMappedObject<T extends parameterSpecTemplate> = {
  [K in keyof T]: getMappedValue<T, K>;
};

type getMappedValue<
  T extends parameterSpecTemplate,
  K extends keyof T
> = getTypeOfserializer<getTypeOfArray<T[K]>>;

type getTypeOfArray<ArrayType extends readonly unknown[]> = ArrayType[number];
type getTypeOfserializer<T> = T extends serializer<infer I> ? I : never;

type getRequiredKeys<T> = Pick<
  T,
  {
    [K in keyof T]: undefined extends T[K] ? never : K;
  }[keyof T]
>;

type getOptionalKeys<T> = Pick<
  T,
  {
    [K in keyof T]: undefined extends T[K] ? K : never;
  }[keyof T]
>;

export type parameterSpecToType<parameterSpec extends parameterSpecTemplate> =
  Partial<getOptionalKeys<getMappedObject<parameterSpec>>> &
    getRequiredKeys<getMappedObject<parameterSpec>>;

export type routeContainerToType<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate
> = {
  [routeIndex in routeName]: parameterSpecToType<parameterSpec>;
};

export type routeObj<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
> = {
  Link: ComponentContainer<
    {
      parameter: parentParameter &
        routeContainerToType<routeName, parameterSpec>;
      children: any;
    },
    any,
    any
  >;
};

export type RouteToParameter<route extends routeObj<any, any, any>> =
  route extends routeObj<any, any, infer I> ? I : unknown;
