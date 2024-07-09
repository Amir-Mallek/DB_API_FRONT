import { Injectable } from '@angular/core';
import {DbConnectionService} from "./db-connection.service";
import {SelectDto} from "../model/dtos/SelectDto";
import {Table} from "../model/Table";

@Injectable({
  providedIn: 'root'
})
export class DbManagerService {
  constructor(private dbc: DbConnectionService) { }

  getSchemas(): string[] {
    let schemas: string[] = [];
    const query = {
      cols: ["SCHEMA_NAME"]
    }
    this.dbc.fetch(query, 'INFORMATION_SCHEMA', 'SCHEMATA').subscribe(
      (response) => {
        for (let row of response.data) {
          schemas.push(row['SCHEMA_NAME']);
        }
      }
    );
    return schemas;
  }

  getTables(schema: string): Table[] {
    let tables: Table[] = [];
    const query = {
      cols: [
        'TABLE_NAME',
        'TABLE_ROWS',
        'DATA_LENGTH',
        'INDEX_LENGTH',
        'CREATE_TIME',
        'UPDATE_TIME'
      ],
      where: {
        type: 'condition',
        op1: {
          type: 'column',
          name: 'TABLE_SCHEMA'
        },
        op2: {
          type: 'value',
          value: schema
        },
        operator: '='
      },
      orderBy: {
        'TABLE_NAME': true
      }
    }
    this.dbc.fetch(query, 'INFORMATION_SCHEMA', 'TABLES').subscribe(
      (response) => {
        for (let row of response.data) {
          tables.push(new Table(
            row['TABLE_NAME'],
            row['CREATE_TIME'],
            (row['UPDATE_TIME']) ? row['UPDATE_TIME'] : row['CREATE_TIME'],
            (row['TABLE_ROWS']) ? row['TABLE_ROWS'] : 0,
            row['DATA_LENGTH'] + row['INDEX_LENGTH']
          ));
        }
      }
    );
    return tables;
  }

  getColumns(schema: string, table: string): string[] {
    let columns: string[] = [];
    const query = {
      cols: [
        'COLUMN_NAME'
      ],
      where: {
        type: 'condition',
        op1:{
          type: 'condition',
          op1: {
            type: 'column',
            name: 'TABLE_SCHEMA'
          },
          op2: {
            type: 'value',
            value: schema
          },
          operator: '='
        },
        op2: {
          type: 'condition',
          op1: {
            type: 'column',
            name: 'TABLE_NAME'
          },
          op2: {
            type: 'value',
            value: table
          },
          operator: '='
        },
        operator: 'AND',
        orderBy: {
          'ORDINAL_POSITION': true
        }
      }
    }
    this.dbc.fetch(query, 'INFORMATION_SCHEMA', 'COLUMNS').subscribe(
      (response) => {
        for (let row of response.data) {
          columns.push(row['COLUMN_NAME']);
        }
      }
    );
    return columns;
  }

}
