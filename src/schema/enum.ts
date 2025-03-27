import type { schema } from "../types";
import { propertyHandler } from "./util";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

type Enumschema<T, U> = NoInfer<
  schema<
    T | (null extends U ? null : never),
    T | (U extends T ? null : never) | (U extends null ? null : never)
  >
>;

export default function <
  T extends { [key: string]: schema<any, any> | null },
  U extends null | undefined = undefined,
>(opt: {
  enumerations: T;
  default?: U;
}): Enumschema<
  {
    [PropertyName in keyof T]: {
      type: PropertyName;
      value:
        | (null extends T[PropertyName] ? null : never)
        | (T[PropertyName] extends schema<infer R, any> ? R : never);
    };
  }[keyof T],
  IsAny<U, undefined, U>
> {
  return {
    // eslint-disable-next-line require-yield
    fromUrl: function* (tokenizer, hasValues) {
      if (hasValues === false) {
        if (opt?.default !== undefined) {
          return opt.default;
        }
        throw new Error("No default value provided");
      }
      const enumKind = tokenizer.eat({ type: "TEXT" });

      if (enumKind.value in opt.enumerations) {
        const enumOpt = opt.enumerations[enumKind.value];

        if (enumOpt === null) {
          return {
            type: enumKind.value,
            value: null,
          } as any;
        }

        const propertyGenerator = propertyHandler(tokenizer, enumOpt);

        while (true) {
          const propertyResult = propertyGenerator.next(hasValues);

          if (propertyResult.done === true) {
            return {
              type: enumKind.value,
              value: propertyResult.value,
            };
          } else {
            hasValues = yield;

            if (hasValues === false || tokenizer.lookahead(enumKind) === null) {
              const propertyResult = propertyGenerator.next(false);

              if (propertyResult.done === true) {
                return {
                  type: enumKind.value,
                  value: propertyResult.value,
                };
              } else {
                throw new Error(
                  "After null is given, generator has to be done",
                );
              }
            } else {
              tokenizer.eat(enumKind);
            }
          }
        }
      } else {
        throw new Error(`Could not find enumeration ${enumKind.value}`);
      }
    },
    toUrl: function (enumValue) {
      if (enumValue === null) {
        return null;
      }

      return {
        [enumValue.type]:
          opt.enumerations[enumValue.type]?.toUrl(enumValue.value) ?? null,
      };
    },
    isEqual: function (value) {
      return value === null;
    },
    default: opt?.default,
  };
}
