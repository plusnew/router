import { SpecToType, RouteParamsSpec } from '../types/mapper';
import formatPath from './formatPath';

const PATH_DELIMITER = '/';

const serializer = {
  boolean(value: string) {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    throw new Error(`${value} is not a valid boolean`);
  },
  number(value: string) {
    const result = Number(value);

    // @TODO evaluate if a stricter number parser makes sense /(-)?([0-9]+)(.[0-9]+)?/
    if (isNaN(result) === true) {
      throw new Error(`${value} is not a valid number`);
    }
    return result;
  },
  date(value: string) {
    const date = new Date(this.number(value));
    if (isNaN(date.getTime()) === true) {
      throw new Error(`${value} is not a valid date`);
    }
    return date;
  },
  string(value: string) {
    return value;
  },
};

function convert(value: unknown) {
  if (value instanceof Date) {
    return value.getTime().toString();
  }
  return value;
}

export function isNamespaceActive(namespace: string, url: string) {
  return formatPath(url).indexOf(namespace) === 0;
}

export function createUrl <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, params: any) {
  return (Object.keys(spec)).reduce((previousValue, specKey) => {
    return previousValue + specKey + PATH_DELIMITER + convert(params[specKey]) + PATH_DELIMITER;
  }, namespace);
}

export function parseUrl <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, url: string) {
  if (isNamespaceActive(namespace, url) === false) {
    throw new Error('Can not parse Url for wrong namespace');
  }

  const paramUrlParts = formatPath(url).slice(namespace.length).split(PATH_DELIMITER);

  const result: any = {};
  for (let i = 0; i < paramUrlParts.length; i += 2) {
    const paramKey = paramUrlParts[i];
    if (paramKey) {
      if (paramKey in spec) {
        try {
          result[paramKey] = serializer[spec[paramKey]](paramUrlParts[i + 1]);
        } catch (err) {
          throw new Error(`The url ${url} has incorrect parameter ${paramKey}`);
        }
      } else {
        throw new Error(`The url ${url} has unknown parameter ${paramKey}`);
      }
    }
  }

  Object.keys(spec).forEach((paramKey) => {
    if (paramKey in result === false) {
      throw new Error(`The url ${url} is missing the parameter ${paramKey}`);
    }
  });

  return result as SpecToType<Spec>;
}
