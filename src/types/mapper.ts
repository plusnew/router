export interface SpecToTypeMapping {
  'string': string;
  'number': number;
  'boolean': boolean;
}

export type RouteParamsSpec = {
  [paramName: string]: keyof SpecToTypeMapping,
};

export type SpecToType<Param extends RouteParamsSpec> = {
  [ParamType in keyof Param]: SpecToTypeMapping[Param[ParamType]]
};
