type converterToUrlResult = { valid: false } | { valid: true, value: string | undefined};
type converterFromUrlResult<T> = { valid: false } | { valid: true, value: T };

export interface converter<T> {
  displayName: string;
  toUrl: (from: T) => converterToUrlResult;
  fromUrl: (from: string | undefined) => converterFromUrlResult<T>;
}

export type RouteParameterSpec = {
  [paramName: string]: readonly converter<any>[],
};

type getMappedObject<T extends RouteParameterSpec> = {
  [K in keyof T]: getMappedValue<T, K>
}

type getMappedValue<T extends RouteParameterSpec, K extends keyof T> = getTypeOfConverter<getTypeOfArray<T[K]>>;

type getTypeOfArray<ArrayType extends readonly unknown[]> = ArrayType[number];
type getTypeOfConverter<T> = T extends converter<infer I> ? I : never;

type getRequiredKeys<T> = Pick<T, {
  [K in keyof T]: undefined extends T[K] ? never : K
}[keyof T]>;

type getOptionalKeys<T> = Pick<T, {
  [Key in keyof T]: undefined extends T[Key] ? Key : never
}[keyof T]>;

export type SpecToType<Spec extends RouteParameterSpec> =
  Partial<getOptionalKeys<getMappedObject<Spec>>>
