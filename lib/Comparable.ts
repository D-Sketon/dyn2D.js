export interface Comparable<E> {
  compareTo?(o: E): number;
  equals?(o: E): boolean;
}

export function compareTo<E extends Comparable<E>>(t: E, o: E): number {
  return t.compareTo ? t.compareTo(o) : (t < o ? -1 : t > o ? 1 : 0);
}

export function equals<E extends Comparable<E>>(t: E, o: E): boolean {
  return (t.equals && t.equals(o)) || (!t.equals && t === o);
}