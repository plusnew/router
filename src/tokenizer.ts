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

export class Tokenizer {
  private index = 0;
  private tokens: Token[];
  public done: boolean;
  constructor(url: string) {
    this.tokens = tokenize(url);
    this.done = this.index === this.tokens.length;
  }

  eat<T extends keyof typeof TOKENS | "TEXT">(
    eatToken: { type: T } | { type: "TEXT"; value: string },
  ): Extract<Token, { type: T }> {
    const currentToken = this.lookahead(eatToken);

    if (currentToken === null) {
      throw new Error(
        `Couldnt find token ${eatToken.type}, but ${this.tokens[this.index].type}`,
      );
    }
    this.index++;
    this.done = this.index === this.tokens.length;

    return currentToken;
  }
  lookahead<T extends keyof typeof TOKENS | "TEXT">(
    eatToken: { type: T } | { type: "TEXT"; value: string },
  ): Extract<Token, { type: T }> | null {
    this.checkDone();

    const currentToken = this.tokens[this.index];
    if (currentToken.type === eatToken.type) {
      if (
        "value" in currentToken &&
        "value" in eatToken &&
        currentToken.value !== eatToken.value
      ) {
        return null;
      }
      return currentToken as any;
    } else {
      return null;
    }
  }

  private checkDone() {
    if (this.done === true) {
      throw new Error("No new tokens available");
    }
  }
}

function tokenize(url: string) {
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

    if (i === 0 && result.type === "PATH_SEPERATOR") {
      continue;
    }

    tokens.push(result);
  }
  if (
    tokens.length === 0 ||
    tokens[tokens.length - 1].type !== "PATH_SEPERATOR"
  ) {
    tokens.push({ type: "PATH_SEPERATOR" });
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
