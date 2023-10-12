/**
 * The estimated collisions per object.
 */
const ESTIMATED_COLLISIONS_PER_OBJECT = 4;

/**
 * An estimate of the number of objects that will be hit when raycasting assuming uniform
 * distribution of objects.
 */
const ESTIMATED_RAYCAST_DENSITY = 0.02;

/**
 * Returns an estimate on the number of collision pairs based on the number objects being simulated.
 * @param n The number of objects being simulated.
 * @returns The estimated number of collision pairs.
 */
export function getEstimatedCollisionPairs(n: number): number {
  return n * ESTIMATED_COLLISIONS_PER_OBJECT;
}

/**
 * Returns an estimate on the number of collisions per object.
 * @returns An estimate on the number of collisions per object.
 */
export function getEstimatedCollisionsPerObject(): number {
  return ESTIMATED_COLLISIONS_PER_OBJECT;
}

/**
 * Returns an estimate on the number of raycast collisions given the total number
 * of objects to collide with.
 * @param n The number of objects to collide with.
 * @returns An estimate on the number of raycast collisions.
 */
export function getEstimatedRaycastCollisions(n: number): number {
  return Math.floor(Math.max(1, n * ESTIMATED_RAYCAST_DENSITY));
}