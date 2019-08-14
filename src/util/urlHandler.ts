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
  return (Object.entries(spec)).reduce((previousValue, [specKey, serializers], index) => {

    for (const serializer of serializers) {
      const serializerResult = serializer.toUrl(params[specKey]);

      if (serializerResult.valid === true) {
        let result = previousValue;
        if (index === 0) {
          result += NAMESPACE_PARAMETER_DELIMITER;
        } else {
          result += PARAMETER_DELIMITER;
        }

        result += `${specKey}${PARAMETER_PARAMETERVALUE_DELIMITER}${serializerResult.value}`;
        return result;
      }
    }

    const type = serializers.map(serializer => serializer.displayName).join(', ');
    throw new Error(
      `Could not create url for property ${specKey} with value ${params[specKey]}, it is not of the correct type ${type}`,
    );
  }, PATH_DELIMITER + namespace);
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
    if (specKey in parameters === false) {
      throw new Error(`The url ${url} is missing the parameter ${specKey}`);
    }

    const [serializer] = spec[specKey];
    const serializerResult = serializer.fromUrl(parameters[specKey]);
    if (serializerResult.valid === true) {
      result[specKey] = serializerResult.value;
    } else {
      throw new Error(`The url ${url} has incorrect parameter ${specKey}, it is not parsable as ${serializer.displayName}`);
    }
  }

  return result as SpecToType<Spec>;
}
