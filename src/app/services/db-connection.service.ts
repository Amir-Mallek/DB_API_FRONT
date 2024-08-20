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
  private baseUrl: string = 'http://192.168.100.20:8080/db-api';

  constructor(private http: HttpClient) { }

  fetch(selectQuery: any, schema: string, table: string) {
    const url = `${this.baseUrl}/${schema}/${table}`;
    return this.http.patch<SelectResponse>(url, selectQuery);
  }

  remove(deleteQuery: any, schema: string, table: string) {
    const url = `${this.baseUrl}/delete/${schema}/${table}`;
    return this.http.patch<UpdateResponse>(url, deleteQuery);
  }

  save(insertQuery: any, schema: string, table: string) {
    const url = `${this.baseUrl}/${schema}/${table}`;
    return this.http.post<UpdateResponse>(url, insertQuery);
  }

  update(updateQuery: any, schema: string, table: string) {
    const url = `${this.baseUrl}/${schema}/${table}`;
    return this.http.put<UpdateResponse>(url, updateQuery);
  }

  showDb() {
    const url = `${this.baseUrl}/info`;
    return this.http.get<SelectResponse>(url);
  }

  showTables(schema: string) {
    const url = `${this.baseUrl}/info/${schema}`;
    return this.http.get<SelectResponse>(url);
  }

  describeTable(schema: string, table: string) {
    const url = `${this.baseUrl}/info/${schema}/${table}`;
    return this.http.get<SelectResponse>(url);
  }

  execute(sql: string): Observable<DbResponse> {
    const url = `${this.baseUrl}/execute`;
    return this.http.post<DbResponse>(url, sql);
  }
}
