type serializerToUrlResult =
  | { valid: false }
  | { valid: true; value: string | undefined };
type serializerFromUrlResult<T> = { valid: false } | { valid: true; value: T };

export type Serializer<T> = {
  displayName: string;
  toUrl: (from: T) => serializerToUrlResult;
  fromUrl: (from: string | undefined) => serializerFromUrlResult<T>;
};
