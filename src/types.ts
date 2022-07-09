type serializerToUrlResult =
  | { valid: false }
  | { valid: true; value: string | undefined };
type serializerFromUrlResult<T> = { valid: false } | { valid: true; value: T };

export type Serializer<T> = {
  displayName: string;
  toUrl: (from: T) => serializerToUrlResult;
  fromUrl: (from: string | undefined) => serializerFromUrlResult<T>;
};

export type parameterSpecTemplate = {
  [paramName: string]: readonly Serializer<any>[];
};

export type parameterSpecToType<T extends parameterSpecTemplate> = {
  [K in keyof T]: getMappedValue<T, K>;
};

type getMappedValue<
  T extends parameterSpecTemplate,
  K extends keyof T
> = getTypeOfserializer<getTypeOfArray<T[K]>>;

type getTypeOfArray<ArrayType extends readonly unknown[]> = ArrayType[number];
type getTypeOfserializer<T> = T extends Serializer<infer I> ? I : never;
