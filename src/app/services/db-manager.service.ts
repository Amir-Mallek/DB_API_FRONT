import { Injectable } from '@angular/core';
import {DbConnectionService} from "./db-connection.service";
import {Table} from "../model/table";
import {map, Observable} from "rxjs";
import {Column} from "../model/column";

@Injectable({
  providedIn: 'root'
})
export class DbManagerService {
  constructor(private dbc: DbConnectionService) { }

  private buildOperand(primValues: any[], primaryKey: string, index: number) {
    return {
      type: 'condition',
      op1: {
        type: 'column',
        name: primaryKey
      },
      op2: {
        type: 'value',
        value: primValues[index]
      },
      operator: '='
    };
  }

  private buildCondition(primValues: any[], primaryKey: string, index: number): any {
    if (index == primValues.length) {
      return {
        type: 'value',
        value: false
      };
    }
    return {
      type: 'condition',
      op1: this.buildOperand(primValues, primaryKey, index),
      op2: this.buildCondition(primValues, primaryKey, index + 1),
      operator: 'OR'
    };
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
            row['Type'],
            row['Null'] == 'YES',
            row['Key'] == 'PRI',
            row['Extra'] == 'auto_increment'
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

  deleteRows(
    schema: string,
    table: string,
    primValues: any[],
    primaryKey: string
  ): Observable<boolean> {
    const query = {
      where: this.buildCondition(primValues, primaryKey, 0)
    };

    return this.dbc.remove(query, schema, table).pipe(
      map((response) => {
        return response.status == 'SUCCESS';
      })
    );
  }

}
