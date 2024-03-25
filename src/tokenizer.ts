import type { Token } from "./types";

export const TOKENS = {
  PATH_SEPERATOR: "/" as const,
  VALUE_SEPERATOR: ";" as const,
  LIST_SEPERATOR: " as const," as const,
  PROPERTY_SEPERATOR: "." as const,
  VALUE_ASSIGNMENT: "=" as const,
  LIST_OPEN: "[" as const,
  LIST_CLOSE: "]" as const,
};

const TOKEN_KEYS = Object.keys(TOKENS) as (keyof typeof TOKENS)[];
const TOKEN_VALUES = Object.values(TOKENS);

export function tokenize(url: string) {
  const tokens: Token[] = [];
  for (let i = 0; i < url.length; i++) {
    let result = getToken(url, i);
    if (result === null) {
      result = {
        type: "TEXT",
        value: url[i],
      };

      while (i + 1 < url.length) {
        const nextToken = getToken(url, i + 1);
        if (nextToken === null) {
          result.value += url[i + 1];

          i++;
        } else {
          tokens.push(result);
          result = nextToken;

          i++;

          break;
        }
      }
    }
    tokens.push(result);
  }
  return tokens;
}

function getToken(url: string, index: number): Token | null {
  const result = (TOKEN_VALUES as string[]).indexOf(url[index]);

  if (result !== -1) {
    return {
      type: TOKEN_KEYS[result],
    };
  }
  return null;
}
