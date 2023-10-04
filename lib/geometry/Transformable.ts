import { Rotatable } from "./Rotatable";
import { Translatable } from "./Translatable";

/**
 * Represents an object that is both {@link Rotatable} and {@link Translatable}.
 */
export interface Transformable extends Rotatable, Translatable {

}