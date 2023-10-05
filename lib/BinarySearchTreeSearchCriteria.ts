import { Comparable } from "./Comparable";

/**
 * Represents criteria for performing a binary search on a {@link BinarySearchTree}.
 */
export interface BinarySearchTreeSearchCriteria<E extends Comparable<E>> {
/**
 * Evaluates the current comparable determining which child to navigate
 * to next.
 * 
 * - Return zero to stop the search.
 * - Return less than zero to continue searching to the left.
 * - Return greater than zero to continue searching to the right
 * @param comparable The current comparable
 * @returns The result of the evaluation.
 */
  evaluate(comparable: E): number;
}