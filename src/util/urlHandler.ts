import { RouteParamsSpec, SpecToType } from '../types/mapper';
import formatPath from './formatPath';

const PATH_DELIMITER = '/';
const NAMESPACE_PARAMETER_DELIMITER = '?';
const PARAMETER_DELIMITER = '&';
const PARAMETER_PARAMETERVALUE_DELIMITER = '=';

export function isNamespaceActive(namespace: string, url: string) {
  const [path] = url.split(NAMESPACE_PARAMETER_DELIMITER);
  return formatPath(path) === formatPath(namespace);
}

export function createUrl <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, params: SpecToType<Spec>) {
  return (Object.entries(spec)).reduce((previousValue, [paramKey, specType], index) => {
    let result = previousValue;
    if (index === 0) {
      result += NAMESPACE_PARAMETER_DELIMITER;
    } else {
      result += PARAMETER_DELIMITER;
    }

    if (paramKey in params) {
      const [serializer] = spec[paramKey];
      const serializerResult = serializer.toUrl(params[paramKey]);
      if (serializerResult.valid === true) {
        result += `${paramKey}${PARAMETER_PARAMETERVALUE_DELIMITER}${serializerResult.value}`;
        return result;
      }
      throw new Error(
        `Could not create url for property ${paramKey} with value ${params[paramKey]}, it is not of the correct type ${serializer.displayName}`,
      );
    }
    throw new Error(`Could not create url for ${namespace}, the property ${paramKey} was missing`);
  }, PATH_DELIMITER + namespace);
}

export function parseUrl <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, url: string) {
  if (isNamespaceActive(namespace, url) === false) {
    throw new Error(`Can not parse url ${url} for wrong namespace ${namespace}`);
  }

  const [, paramUrlPart] = url.split(NAMESPACE_PARAMETER_DELIMITER);

  const paramUrlParts = paramUrlPart ? paramUrlPart.split(PARAMETER_DELIMITER) : [];

  const result: any = {};
  for (let i = 0; i < paramUrlParts.length; i += 1) {
    const [paramKey, paramValue] = paramUrlParts[i].split(PARAMETER_PARAMETERVALUE_DELIMITER);
    if (paramKey) {
      if (paramKey in spec) {
        const [serializer] = spec[paramKey];
        const serializerResult = serializer.fromUrl(paramValue);
        if (serializerResult.valid === true) {
          result[paramKey] = serializerResult.value;
        } else {
          throw new Error(`The url ${url} has incorrect parameter ${paramKey}, it is not parsable as ${serializer.displayName}`);
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
