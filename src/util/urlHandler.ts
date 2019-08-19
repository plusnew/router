import { RouteParameterSpec, SpecToType } from '../types/mapper';
import formatPath from './formatPath';

const PATH_DELIMITER = '/';
const NAMESPACE_PARAMETER_DELIMITER = '?';
const PARAMETER_DELIMITER = '&';
const PARAMETER_PARAMETERVALUE_DELIMITER = '=';

export function isNamespaceActive(namespace: string, url: string) {
  const [path] = url.split(NAMESPACE_PARAMETER_DELIMITER);
  return formatPath(path) === formatPath(namespace);
}

export function createUrl<Spec extends RouteParameterSpec>(namespace: string, spec: Spec, params: SpecToType<Spec>) {
  const path = PATH_DELIMITER + namespace;

  return (Object.entries(spec)).reduce((previousValue, [specKey, serializers], index) => {

    const paramValue = (params as { [key: string]: string | undefined})[specKey];

    for (const serializer of serializers) {
      const serializerResult = serializer.toUrl(paramValue);

      if (serializerResult.valid === true) {
        if (serializerResult.value === undefined) {
          return previousValue;
        }
        let result = previousValue;

        if (previousValue === path) { // When currentvalue is still the path value, then this is the first parameter added
          result += NAMESPACE_PARAMETER_DELIMITER;
        } else {
          result += PARAMETER_DELIMITER;
        }

        result += `${specKey}${PARAMETER_PARAMETERVALUE_DELIMITER}${serializerResult.value}`;
        return result;
      }
    }

    const type = serializers.map(serializer => serializer.displayName).join(' | ');
    throw new Error(
      `Could not create url for ${namespace}, the property ${specKey} was not serializable as ${type} with the value ${paramValue}`,
    );
  }, path);
}

export function parseUrl<Spec extends RouteParameterSpec>(namespace: string, spec: Spec, url: string) {
  if (isNamespaceActive(namespace, url) === false) {
    throw new Error(`Can not parse url ${url} for wrong namespace ${namespace}`);
  }

  const [, paramUrlPart] = url.split(NAMESPACE_PARAMETER_DELIMITER);

  const paramUrlParts = paramUrlPart ? paramUrlPart.split(PARAMETER_DELIMITER) : [];

  const result: any = {};
  const parameters: { [key: string]: string } = {};
  for (let i = 0; i < paramUrlParts.length; i += 1) {
    const [paramKey, paramValue] = paramUrlParts[i].split(PARAMETER_PARAMETERVALUE_DELIMITER);
    if (paramKey in spec) {
      parameters[paramKey] = paramValue;
    } else {
      throw new Error(`The url ${url} has unknown parameter ${paramKey}`);
    }
  }

  for (const specKey in spec) {
    let valid = false;

    const serializers = spec[specKey];
    for (const serializer of serializers) {
      const serializerResult = serializer.fromUrl(parameters[specKey]);
      if (serializerResult.valid === true) {
        if (serializerResult.value !== undefined) {
          result[specKey] = serializerResult.value;
        }
        valid = true;
        break;
      }
    }

    const types = serializers.map(serializer => serializer.displayName).join(' | ');
    if (valid === false) {
      throw new Error(`The url ${url} has incorrect parameter ${specKey}, it is not parsable as ${types}`);
    }
  }

  return result as SpecToType<Spec>;
}
