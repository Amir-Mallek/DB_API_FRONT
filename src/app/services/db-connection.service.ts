import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SelectResponse} from "../model/response/SelectResponse";
import {DeleteResponse} from "../model/response/DeleteResponse";

@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  constructor(private http: HttpClient) { }

  fetch(selectQuery: any, schema: string, table: string) {
    const url = `http://localhost:8080/db-api/${schema}/${table}`;
    return this.http.patch<SelectResponse>(url, selectQuery);
  }

  remove(deleteQuery: any, schema: string, table: string) {
    const url = `http://localhost:8080/db-api/${schema}/${table}/delete`;
    return this.http.patch<DeleteResponse>(url, deleteQuery);
  }

  showDb() {
    const url = 'http://localhost:8080/db-api/info';
    return this.http.get<SelectResponse>(url);
  }

  showTables(schema: string) {
    const url = `http://localhost:8080/db-api/info/${schema}`;
    return this.http.get<SelectResponse>(url);
  }

  describeTable(schema: string, table: string) {
    const url = `http://localhost:8080/db-api/info/${schema}/${table}`;
    return this.http.get<SelectResponse>(url);
  }

}
