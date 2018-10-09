import { RouteParamsSpec, SpecToType } from 'types/mapper';

const PATH_DELIMITER = '/';

export default class UrlHandler<Spec extends RouteParamsSpec> {
  public namespace: string;
  private spec: Spec;

  constructor(namespace: string, spec: Spec) {
    this.namespace = this.formatPath(namespace);
    this.spec = spec;
  }

  private serializer = {
    number(value: string) {
      const result = Number(value);

      if (isNaN(result) === true) {
        throw new Error(`${value} is not a valid number`);
      }
      return result;
    },
    date(value: string) {
      const date = new Date(value);
      if (isNaN(date.getTime()) === true) {
        throw new Error(`${value} is not a valid date`);
      }
      return date;
    },
  };

  private formatPath(path: string) {
    let result = path;

    if (result[0] !== PATH_DELIMITER) {
      result = PATH_DELIMITER + result;
    }

    if (result[result.length - 1] !== PATH_DELIMITER) {
      result = result + PATH_DELIMITER;
    }

    return result;
  }

  public isCurrentNamespace(url: string) {
    return this.formatPath(url).indexOf(this.namespace) === 0;
  }

  public parseUrl(url: string): SpecToType<Spec> {
    if (this.isCurrentNamespace(url) === false) {
      throw new Error('Can not parse Url for wrong namespace');
    }

    const paramUrlParts = this.formatPath(url).slice(this.namespace.length, - 1).split(PATH_DELIMITER);

    const result: Partial<SpecToType<Spec>> = {};
    for (let i = 0; i < paramUrlParts.length; i += 2) {
      const paramKey = paramUrlParts[i];
      if (paramKey) {
        if (paramKey in this.spec) {
          result[paramKey] = undefined;
        } else {
          throw new Error(`The url ${url} has unknown parameter ${paramKey}`);
        }
      }
    }

    Object.keys(this.spec).forEach((paramKey) => {
      if (paramKey in result === false) {
        console.log('params:', arguments);
        throw new Error(`The url ${url} is missing the parameter ${paramKey}`);
      }
    });

    return result as SpecToType<Spec>;
  }

  public buildUrl(params: SpecToType<Spec>) {
    return (Object.keys(this.spec)).reduce((previousValue, specKey) => {
      return previousValue + specKey + PATH_DELIMITER + this.serialize(params[specKey]) + PATH_DELIMITER;
    }, this.namespace);
  }

  private serialize(value: unknown) {
    if (value instanceof Date) {
      return value.getTime().toString();
    }
    return value;
  }
}
