import { linkHandler, routeState } from '../contexts/urlHandler';
import { parameterSpecTemplate, parameterSpecToType } from '../types/mapper';

const PATH_DELIMITER = '/';
const PARAMETER_DELIMITER = ';';
const PARAMETER_PARAMETERVALUE_DELIMITER = '=';

export const createUrl: linkHandler['createUrl'] = (routeChain, parameter) => {
  return routeChain.reduce((path, routeContainer) => {
    return (Object.entries(routeContainer.parameterSpec))
      .reduce((path, [specKey, serializers]) => {
        const paramValue = (parameter as any)[routeContainer.routeName][specKey];
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
          `Could not create url for ${routeContainer.routeName}, the property ${specKey} was not serializable as ${type} with the value ${paramValue}`,
        );
      }, `${path}${routeContainer.routeName[0] === PATH_DELIMITER ? routeContainer.routeName : PATH_DELIMITER + routeContainer.routeName}`);
  }, '');
};

function getParameterOfRoutePart<spec extends parameterSpecTemplate>(parameter: string[], spec: spec, url: string) {
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

function normalizePath(url: string) {
  let result = url;
  while(result[0] === '/') { // Removes leading slashes
    result = result.slice(1);
  }

  while(result[result.length - 1] === '/') { // Removes trailing slashes
    result = result.slice(0, -1);
  }

  return result;
}

function getUrlParts(url: string): ([string, string])[] {
  return normalizePath(url).split(PATH_DELIMITER)
    .map((urlPart) => {
      const parameterStartPosition = urlPart.indexOf(PARAMETER_DELIMITER);
      if (parameterStartPosition === -1) {
        return [urlPart, ''];
      }
      return [urlPart.slice(0, parameterStartPosition), urlPart.slice(parameterStartPosition + 1)];
    });
}

export const getParameter: linkHandler['getParameter'] = (routeChain, url) => {
  const result: any = {};
  const urlParts = getUrlParts(url);

  let routeIndex = 0;
  let urlPartIndex = 0;

  while (routeIndex < routeChain.length) {
    const routeParts = normalizePath(routeChain[routeIndex].routeName).split(PATH_DELIMITER);
    for (let routePartIndex = 0; routePartIndex < routeParts.length; routePartIndex += 1) {
      const [urlPartrouteName] = urlParts[urlPartIndex];

      if (urlPartrouteName !== routeParts[routePartIndex]) {
        throw new Error(`Can not parse url ${url} for wrong routeName ${routeChain[routeIndex].routeName}`);
      }
      urlPartIndex += 1;
    }
    const [, parameterString] = urlParts[urlPartIndex - 1];
    const parameter = parameterString === '' ? [] : parameterString.split(PARAMETER_DELIMITER);
    result[routeChain[routeIndex].routeName] = getParameterOfRoutePart(parameter, routeChain[routeIndex].parameterSpec, url);
    routeIndex += 1;
  }

  return result;
};

export const getRouteState: linkHandler['getRouteState'] = (routeChain, url) => {
  let active = true;
  const urlParts = getUrlParts(url);

  let routeIndex = 0;
  let urlPartIndex = 0;

  while (active && routeIndex < routeChain.length) {
    const routeParts = normalizePath(routeChain[routeIndex].routeName).split(PATH_DELIMITER);
    for (let routePartIndex = 0; active && routePartIndex < routeParts.length; routePartIndex += 1) {
      if (urlPartIndex >= urlParts.length) {
        active = false;
      } else {
        const [urlPartrouteName] = urlParts[urlPartIndex];
        if (routeParts[routePartIndex] !== urlPartrouteName) {
          active = false;
        }
        urlPartIndex += 1;
      }
    }
    routeIndex += 1;
  }

  if (active && urlParts.length === urlPartIndex) {
    return routeState.active;
  }
  if (active && urlParts.length > urlPartIndex) {
    return routeState.activeAsParent;
  }

  return routeState.inactive;
};
