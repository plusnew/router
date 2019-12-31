import { linkHandler } from 'contexts/urlHandler';
import { parameterSpecToType, parameterSpecTemplate } from 'types/mapper';

const PATH_DELIMITER = '/';
const PARAMETER_DELIMITER = ';';
const PARAMETER_PARAMETERVALUE_DELIMITER = '=';

export const createUrl: linkHandler['createUrl'] = (routeChain, parameter) => {
  return routeChain.reduce((path, routeContainer) => {
    return Object.entries(routeContainer.parameterSpec).reduce((path, singleSpec) => {
      return `${path}`;
    }, `${path}${PATH_DELIMITER}${routeContainer.namespace}`);
  }, PATH_DELIMITER);
};

function getParameter<spec extends parameterSpecTemplate>(parameter: string[], spec: spec) {
  const result: any = {};
  const parameters: { [key: string]: string } = {};
  for (let i = 0; i < parameter.length; i += 1) {
    const [paramKey, paramValue] = parameter[i].split(PARAMETER_PARAMETERVALUE_DELIMITER);
    if (paramKey in spec) {
      parameters[paramKey] = paramValue;
    } else {
      throw new Error(`The url ${parameter.join(PARAMETER_DELIMITER)} has unknown parameter ${paramKey}`);
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
      throw new Error(`The url ${parameter.join(PARAMETER_DELIMITER)} has incorrect parameter ${specKey}, it is not parsable as ${types}`);
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
        if (acc && // route can only be same, if the previous ones were the same
          routeChain.length > urlIndex && // Cant be the same if routechain is shorter
          routeChain[urlIndex].namespace === urlNamespace
        ) { // route is same when route namespace and urlpart are same
          return {
            ...acc,
            [urlNamespace]: getParameter(parameter, routeChain[urlIndex].parameterSpec),
          };
        }
        throw new Error('That url is not parseble for this route');
      },
      {} as any,
    );
};

export const isNamespaceActive: linkHandler['isNamespaceActive'] = (routeChain, url) => {
  return getUrlParts(url)
    .every(([namespace], index) => routeChain[index].namespace === namespace);
};
