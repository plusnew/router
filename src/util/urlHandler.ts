import { linkHandler } from 'contexts/urlHandler';
import { parameterSpecToType, parameterSpecTemplate } from 'types/mapper';

const PATH_DELIMITER = '/';
const PARAMETER_DELIMITER = ';';
const PARAMETER_PARAMETERVALUE_DELIMITER = '=';

export const createUrl: linkHandler['createUrl'] = (routeChain, parameter) => {
  return routeChain.reduce((path, routeContainer) => {
    return (Object.entries(routeContainer.parameterSpec))
      .reduce((path, [specKey, serializers]) => {
        const paramValue = (parameter as any)[routeContainer.namespace][specKey];
        for (const serializer of serializers) {
          const serializerResult = serializer.toUrl(paramValue);

          if (serializerResult.valid === true) {
            if (serializerResult.value === undefined) {
              return path;
            }

            return `${path}${PARAMETER_DELIMITER}${specKey}${PARAMETER_PARAMETERVALUE_DELIMITER}${serializerResult.value}`;
          }
        }

        const type = serializers.map(serializer => serializer.displayName).join(' | ');

        throw new Error(
          `Could not create url for ${routeContainer.namespace}, the property ${specKey} was not serializable as ${type} with the value ${paramValue}`,
        );
      }, `${path}${PATH_DELIMITER}${routeContainer.namespace}`);
  }, PATH_DELIMITER);
};

function getParameter<spec extends parameterSpecTemplate>(parameter: string[], spec: spec, url: string) {
  const result: any = {};
  const parameterObject: { [key: string]: string } = {};
  for (let i = 0; i < parameter.length; i += 1) {
    const [paramKey, paramValue] = parameter[i].split(PARAMETER_PARAMETERVALUE_DELIMITER);
    if (paramKey in spec) {
      parameterObject[paramKey] = paramValue;
    } else {
      throw new Error(`The url ${url} has unknown parameter ${paramKey}`);
    }
  }

  for (const specKey in spec) {
    let valid = false;

    const serializers = spec[specKey];
    for (const serializer of serializers) {
      const serializerResult = serializer.fromUrl(parameterObject[specKey]);
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

  return result as parameterSpecToType<spec>;
}

function getUrlParts(url: string): ([string, string])[] {
  return url.split(PATH_DELIMITER)
    .filter(urlPart => urlPart !== '') // remove pre and post slash stuff
    .map((urlPart) => {
      const parameterStartPosition = urlPart.indexOf(PARAMETER_DELIMITER);
      if (parameterStartPosition === -1) {
        return [urlPart, ''];
      }
      return [urlPart.slice(0, parameterStartPosition), urlPart.slice(parameterStartPosition + 1)];
    });
}

export const parseUrl: linkHandler['parseUrl'] = (routeChain, url) => {
  return getUrlParts(url).reduce(
    (acc, [urlNamespace, parameterString], urlIndex) => {
      const parameter = parameterString.split(PARAMETER_DELIMITER);
      if (urlIndex >= routeChain.length) { // Cant be the same if routechain is shorter
        throw new Error('That url is not parseble for this route');
      }
      if (routeChain[urlIndex].namespace !== urlNamespace) { // route is same when route namespace and urlpart are same
        throw new Error(`Can not parse url ${url} for wrong namespace ${routeChain[urlIndex].namespace}`);
      }
      return {
        ...acc,
        [urlNamespace]: getParameter(parameter, routeChain[urlIndex].parameterSpec, url),
      };
    },
    {} as any,
  );
};

export const isNamespaceActive: linkHandler['isNamespaceActive'] = (routeChain, url) => {
  return getUrlParts(url)
    .every(([namespace], index) => index < routeChain.length && routeChain[index].namespace === namespace);
};
