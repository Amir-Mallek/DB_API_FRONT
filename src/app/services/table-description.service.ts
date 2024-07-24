import { Injectable } from '@angular/core';
import {BehaviorSubject, map, of} from "rxjs";
import {Column} from "../model/column";
import {DbManagerService} from "./db-manager.service";

@Injectable({
  providedIn: 'root'
})
export class TableDescriptionService {
  currentSchema: string = '';
  currentTable: string = '';
  columns: Column[] = [];

  constructor(private manager: DbManagerService) { }

  getColumns(schema: string, table: string) {
    if (this.currentSchema != schema || this.currentTable != table || this.columns.length === 0) {
      this.currentSchema = schema;
      this.currentTable = table;
      return this.manager
        .getTableDescription(schema, table)
        .pipe(
          map((response) => {
            this.columns = response;
            return this.columns;
          })
        );
    }
    return of(this.columns);
  }

}
