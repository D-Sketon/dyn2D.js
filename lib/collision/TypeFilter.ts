import { Filter } from "./Filter";

/**
 * A base implementation of a class hierarchy {@link Fixture} {@link Filter}.
 */
export abstract class TypeFilter implements Filter {

  public isAllowed(filter: Filter): boolean {
    if (filter == null) return false;
    if (filter == this) return true;
    if (filter instanceof TypeFilter) {
      if (this instanceof filter.constructor() || filter instanceof this.constructor()) {
        return true;
      }
    }
    return false;
  }

  public toString(): string {
    return `TypeFilter[${this.constructor.name}]`;
  }

}