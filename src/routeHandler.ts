import { ParameterSpecificationTemplate, Route } from "types";

export function createRootRoute <T extends ParameterSpecificationTemplate>(parameter: T): Route<{"/": T}> {
    return null as any
};
