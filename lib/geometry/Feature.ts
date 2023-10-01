export abstract class Feature {
  static readonly NOT_INDEXED: number = -1;

  index: number;

  constructor(index: number) {
    this.index = index;
  }

  getIndex(): number {
    return this.index;
  }
}