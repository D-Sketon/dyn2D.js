import { Filter } from "./Filter";

/**
 * A {@link Filter} for categorized fixtures.
 */
export class CategoryFilter implements Filter {
  /**
   * The category this object is in
   */
  category: number;
  /**
   * The categories this object can collide with
   */
  mask: number;

  /**
   * Full constructor.
   * @param category The category this object is in
   * @param mask The categories this object can collide with
   */
  constructor(category: number = 1, mask: number = Number.MAX_SAFE_INTEGER) {
    this.category = category;
    this.mask = mask;
  }

  public isAllowed(filter: Filter): boolean {
    if (filter == null) return true;
    if (filter instanceof CategoryFilter) {
      return (this.category & filter.mask) > 0 && (filter.category & this.mask) > 0;
    }
    return true;
  }

  /**
   * Method to check if this object is equal to another object.
   * @param obj The object to compare to
   * @returns true if the objects are equal
   */
  public equals(obj: any) : boolean{
    if(obj == null) return false;
    if(obj == this) return true;
    if(obj instanceof CategoryFilter) {
      return this.category === obj.category && this.mask === obj.mask;
    }
    return false;
  }

  public toString(): string {
    return `CategoryFilter[category=${this.category}, mask=${this.mask}]`;
  }

  /**
   * Returns the category this object is in.
   * @returns The category this object is in
   */
  public getCategory(): number {
    return this.category;
  }

  /**
   * The categories this object can collide with.
   * @returns The categories this object can collide with
   */
  public getMask(): number {
    return this.mask;
  }
}