export interface Ownable {
  getOwner(): object;
  setOwner(owner: object): void;
}