export class Column {
  name: string;
  type: string;
  nullable: boolean;
  isKey: boolean;

  constructor(name: string, type: string, nullable: boolean, isKey: boolean) {
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.isKey = isKey;
  }
}
