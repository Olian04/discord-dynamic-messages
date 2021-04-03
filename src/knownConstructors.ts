import { ConstructorFunction } from "./types/ConstructorFunction";
import { ConstructorIdentifier } from "./types/ConstructorIdentifier";

// map[id][version] = constructor
const map = new Map<string, Map<string, ConstructorFunction>>();

export const registerConstructor = (
  { id, version }: ConstructorIdentifier,
  constructor: ConstructorFunction
) => {
  if (!map.has(id)) {
    map.set(id, new Map());
  }
  if (map.get(id).has(version)) {
    throw new Error(`Attempting to register ${id}/${version} twice`);
  }
  map.get(id).set(version, constructor);
};

export const findConstructor = ({
  id,
  version,
}: ConstructorIdentifier): ConstructorFunction | null => {
  if (!map.has(id)) return null;
  if (!map.get(id).has(version)) return null;
  return map.get(id).get(version);
};
