import { Injectable } from '@angular/core';
import {DbConnectionService} from "./db-connection.service";
import {Table} from "../model/table";
import {map, Observable} from "rxjs";
import {SelectResponse} from "../model/response/SelectResponse";
import {Column} from "../model/column";

@Injectable({
  providedIn: 'root'
})
export class DbManagerService {
  constructor(private dbc: DbConnectionService) { }

  private getType(type: string): string {
    if (type == 'date' || type == 'time')  return type;
    if (type == 'datetime') return 'datetime-local';
    return 'text';
  }

  getSchemas(): Observable<string[]> {
    let schemas: string[] = [];
    return this.dbc.showDb().pipe(
      map((response) => {
        let schemas: string[] = [];
        for (let row of response.data) {
          schemas.push(row['Database']);
        }
        return schemas;
      })
    );
  }

  getTables(schema: string): Observable<Table[]> {
    return this.dbc.showTables(schema).pipe(
      map((response) => {
        let tables: Table[] = [];
        for (let row of response.data) {
          tables.push(new Table(
            row['Name'],
            row['Create_time'],
            (row['Update_time']) ? row['Update_time'] : row['Create_time'],
            (row['Rows']) ? row['Rows'] : 0,
            row['Data_length'] + row['Index_length']
          ));
        }
        return tables;
      })
    );
  }

  getTableDescription(schema: string, table: string): Observable<Column[]> {
    return this.dbc.describeTable(schema, table).pipe(
      map((response) => {
        let columns: Column[] = [];
        for (let row of response.data) {
          columns.push(new Column(
            row['Field'],
            this.getType(row['Type']),
            row['Null'] == 'YES',
            row['Key'] == 'PRI'
          ));
        }
        return columns;
      })
    );
  }

  getAllRows(schema: string, table: string): Observable<Record<string, any>[]> {
    const query = { cols: [ '*' ] };
    return this.dbc.fetch(query, schema, table).pipe(
      map((response) => {
          return response.data;
      })
    );
  }

}
