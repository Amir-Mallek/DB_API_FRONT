export class Table {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nbRows: number;
  sizeInBits: number;

  constructor(name: string, createdAt: Date, updatedAt: Date, nbRows: number, sizeInBits: number) {
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.nbRows = nbRows;
    this.sizeInBits = sizeInBits;
  }
}
