type serializerToUrlResult =
  | { valid: false }
  | { valid: true; value: string | null };
type serializerFromUrlResult<T> = { valid: false } | { valid: true; value: T };

export type Serializer<T> = {
  displayName: string;
  toPath: (from: unknown) => serializerToUrlResult;
  fromPath: (from: string | null) => serializerFromUrlResult<T>;
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
