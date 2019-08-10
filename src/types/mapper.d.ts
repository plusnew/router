type converterToUrlResult = { valid: false } | { valid: true, value: string};
type converterFromUrlResult<T> = { valid: false } | { valid: true, value: T };

type arrayType<ArrayType extends readonly unknown[]> = ArrayType[number];
type converterType<T> = T extends converter<infer I> ? I : never;

export interface converter<T> {
  displayName: string;
  toUrl: (from: T) => converterToUrlResult;
  fromUrl: (from: string) => converterFromUrlResult<T>;
}

export type RouteParamsSpec = {
  [paramName: string]: readonly converter<any>[],
};

export type SpecToType<Param extends RouteParamsSpec> = {
  [ParamType in keyof Param]: converterType<arrayType<arrayType<[Param[ParamType]]>>>
};