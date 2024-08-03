import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SelectResponse} from "../model/response/SelectResponse";
import {UpdateResponse} from "../model/response/UpdateResponse";
import {DbResponse} from "../model/response/DbResponse";
import {Observable} from "rxjs";

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
    const url = `http://localhost:8080/db-api/delete/${schema}/${table}`;
    return this.http.patch<UpdateResponse>(url, deleteQuery);
  }

  save(insertQuery: any, schema: string, table: string) {
    const url = `http://localhost:8080/db-api/${schema}/${table}`;
    return this.http.post<UpdateResponse>(url, insertQuery);
  }

  update(updateQuery: any, schema: string, table: string) {
    const url = `http://localhost:8080/db-api/${schema}/${table}`;
    return this.http.put<UpdateResponse>(url, updateQuery);
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

  execute(sql: string): Observable<DbResponse> {
    const url = "http://localhost:8080/db-api/execute";
    return this.http.post<DbResponse>(url, sql);
  }
}
