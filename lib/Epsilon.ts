export class Epsilon {

  static E = Epsilon.computed();

  static computed(): number {
    let e = 0.5;
    while (1 + e > 1) {
      e /= 2;
    }
    return e;
  }
}