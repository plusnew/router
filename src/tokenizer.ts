import type { Token } from "./types";

export const TOKENS = {
  PATH_SEPERATOR: "/" as const,
  VALUE_SEPERATOR: ";" as const,
  LIST_SEPERATOR: "," as const,
  PROPERTY_SEPERATOR: "." as const,
  VALUE_ASSIGNMENT: "=" as const,
  LIST_OPEN: "[" as const,
  LIST_CLOSE: "]" as const,
};

const TOKEN_KEYS = Object.keys(TOKENS) as (keyof typeof TOKENS)[];
const TOKEN_VALUES = Object.values(TOKENS);

export class Tokenizer {
  public currentToken: Token | null = null;
  public index = 0;

  constructor(public path: string) {
    this.tokenize();
  }

  public eat<T extends keyof typeof TOKENS | "TEXT">(
    eatToken: { type: T } | { type: "TEXT"; value: string },
  ): Extract<Token, { type: T }> {
    if (this.currentToken === null) {
      throw new Error("No new tokens available");
    }

    const currentToken = this.lookahead(eatToken);

    if (currentToken === null) {
      throw new Error(
        `Couldnt find token ${eatToken.type}, but ${this.currentToken.type}`,
      );
    }

    this.tokenize();

    return currentToken;
  }

  public lookahead<T extends keyof typeof TOKENS | "TEXT">(
    eatToken: { type: T } | { type: "TEXT"; value: string },
  ): Extract<Token, { type: T }> | null {
    if (this.currentToken === null) {
      return null;
    }

    if (this.currentToken.type === eatToken.type) {
      if (
        "value" in this.currentToken &&
        "value" in eatToken &&
        this.currentToken.value !== eatToken.value
      ) {
        return null;
      }
      return this.currentToken as any;
    } else {
      return null;
    }
  }

  private tokenize() {
    if (this.index >= this.path.length) {
      this.currentToken = null;
    } else {
      let token = this.getToken();
      let result = token;
      if (result === null) {
        result = {
          type: "TEXT",
          value: "",
        };

        do {
          if (token === null) {
            result.value += this.path[this.index];

            this.index++;
          } else {
            break;
          }
        } while (((token = this.getToken()), this.index < this.path.length));
      } else {
        this.index++;
      }

      this.currentToken = result;
    }
  }

  private getToken(): Token | null {
    const result = (TOKEN_VALUES as string[]).indexOf(this.path[this.index]);

    if (result !== -1) {
      return {
        type: TOKEN_KEYS[result],
      };
    }
    return null;
  }
}
