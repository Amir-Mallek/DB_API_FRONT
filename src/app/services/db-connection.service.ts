import { Injectable } from '@angular/core';
import {SelectDto} from "../model/dtos/SelectDto";
import {HttpClient} from "@angular/common/http";
import {SelectResponse} from "../model/response/SelectResponse";

@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  constructor(private http: HttpClient) { }

  fetch(selectQuery: any, schema: string, table: string) {
    const url = `http://localhost:8080/db-api/${schema}/${table}`;
    return this.http.patch<SelectResponse>(url, selectQuery);
  }

}
