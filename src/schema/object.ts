import type { InferschemaToUrl, InferschemaFromUrl, schema } from "../types";
import { isDefault, propertyHandler } from "./util";

export default function <T extends { [Property: string]: schema<any, any> }>(
  schemas: T,
): NoInfer<
  schema<
    {
      [PropertyName in keyof T]: InferschemaFromUrl<T[PropertyName]>;
    },
    {
      [PropertyName in keyof T]: InferschemaToUrl<T[PropertyName]>;
    }
  >
> {
  const schemaEntries = Object.entries(schemas);

  return {
    fromUrl: function* (tokenizer, hasValues) {
      const result = {} as {
        [PropertyName in keyof T]: InferschemaFromUrl<T[PropertyName]>;
      };

      while (hasValues) {
        const propertyToken = tokenizer.eat({ type: "TEXT" });

        const propertyGenerator = propertyHandler(
          tokenizer,
          schemas[propertyToken.value],
        );

        while (true) {
          const propertyResult = propertyGenerator.next(hasValues);

          if (propertyResult.done === true) {
            result[propertyToken.value as keyof T] = propertyResult.value;
            break;
          } else {
            hasValues = yield;

            if (
              hasValues === false ||
              tokenizer.lookahead(propertyToken) === null
            ) {
              const propertyResult = propertyGenerator.next(false);

              if (propertyResult.done === true) {
                result[propertyToken.value as keyof T] = propertyResult.value;

                break;
              } else {
                throw new Error(
                  "After null is given, generator has to be done",
                );
              }
            } else {
              tokenizer.eat(propertyToken);
            }
          }
        }

        if (hasValues === true) {
          if (Object.keys(result).length === schemaEntries.length) {
            break;
          }
          hasValues = yield;
        }
      }

      if (hasValues === false) {
        // @TODO implement default handling
        for (const [propertyName, schema] of schemaEntries) {
          if (propertyName in result === false) {
            const propertyGenerator = schema.fromUrl(tokenizer, false);
            const propertyResult = propertyGenerator.next(false);
            if (propertyResult.done === false) {
              throw new Error("When null given schema needs to finish");
            }
            result[propertyName as keyof T] = propertyResult.value;
          }
        }
      }

      return result;
    },
    toUrl: function (parameter) {
      return Object.fromEntries(
        schemaEntries.map(([key, schema]) => {
          return [
            key,

            isDefault(schema, parameter[key])
              ? null
              : schema.toUrl(parameter[key]),
          ];
        }),
      );
    },
    isEqual: function (
      a: {
        [PropertyName in keyof T]: InferschemaToUrl<T[PropertyName]>;
      },
      b: {
        [PropertyName in keyof T]: InferschemaToUrl<T[PropertyName]>;
      },
    ) {
      return schemaEntries.every(([key, schema]) =>
        schema.isEqual(a[key], b[key]),
      );
    },
  };
}
