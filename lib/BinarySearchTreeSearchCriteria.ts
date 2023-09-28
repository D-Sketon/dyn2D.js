import { Comparable } from "./Comparable";

export interface BinarySearchTreeSearchCriteria<E extends Comparable<E>> {
  evaluate(comparable: E): number;
}