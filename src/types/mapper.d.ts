type serializerToUrlResult = { valid: false } | { valid: true, value: string | undefined};
type serializerFromUrlResult<T> = { valid: false } | { valid: true, value: T };

export interface serializer<T> {
  displayName: string;
  toUrl: (from: T) => serializerToUrlResult;
  fromUrl: (from: string | undefined) => serializerFromUrlResult<T>;
}

export type RouteParameterSpec = {
  [paramName: string]: readonly serializer<any>[];
};

type getMappedObject<T extends RouteParameterSpec> = {
  [K in keyof T]: getMappedValue<T, K>;
}

type getMappedValue<T extends RouteParameterSpec, K extends keyof T> = getTypeOfserializer<getTypeOfArray<T[K]>>;

type getTypeOfArray<ArrayType extends readonly unknown[]> = ArrayType[number];
type getTypeOfserializer<T> = T extends serializer<infer I> ? I : never;

type getRequiredKeys<T> = Pick<T, {
  [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T]>;

type getOptionalKeys<T> = Pick<T, {
  [K in keyof T]:undefined extends T[K] ? K : never;
}[keyof T]>;

export type SpecToType<Spec extends RouteParameterSpec> =
  Partial<getOptionalKeys<getMappedObject<Spec>>> &
  getRequiredKeys<getMappedObject<Spec>>;
