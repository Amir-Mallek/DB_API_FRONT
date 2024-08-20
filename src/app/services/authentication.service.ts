import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  inLoginOperation: boolean = false;
  privileges: Record<string, Record<string, string[]>> | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  authenticate(username: string, password: string) {
    const url = 'http://192.168.100.20:8080/db-api/login';
    this.inLoginOperation = true;
    return this.http.post<Record<string, string>>(url, null,{
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      }
    }).pipe(
      map((response) => {
        localStorage.setItem('access_token', response['access_token']);
        localStorage.setItem('username', username);
        this.inLoginOperation = false;
        return true;
      })
    );
  }

  handleUnauthorized(returnUrl: string = '') {
    this.privileges = null;
    localStorage.removeItem('access_token');
    this.router.navigate(
      ['login'],
      {queryParams: {returnUrl: returnUrl}}
    ).then();
  }

  logout() {
    this.privileges = null;
    localStorage.removeItem('access_token');
    this.router.navigate(['login']).then();
  }

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  privilegeIsPresent(
    schema: string,
    table: string,
    operation: string,
    privileges: Record<string, Record<string, string[]>>
  ): boolean {
    return privileges[schema]?.[table]?.includes(operation)
      || privileges[schema]?.['*']?.includes(operation)
      || privileges['*']?.['*']?.includes(operation)
      || false;
  }

  getTablePrivileges(schema: string, table: string): Observable<Record<string, boolean>> {
    return this.getPrivileges().pipe(
      map((privileges) => {
        const result: Record<string, boolean>  = {};
        const ops = ['INSERT', 'UPDATE', 'DELETE', 'SELECT'];
        for (let op of ops) {
          result[op] = this.privilegeIsPresent(schema, table, op, privileges);
        }
        return result;
      })
    );
  }

  getUsername(): string {
    const username = localStorage.getItem('username');
    if (username) return username;
    return '';
  }

  getPrivileges(): Observable<Record<string, Record<string, string[]>>>  {
    if (this.privileges !== null) return of(this.privileges);
    const url = 'http://api:8080/db-api/info/privileges';
    return this.http.get<Record<string, Record<string, string[]>>>(url).pipe(
      map((response) => {
        this.privileges = response;
        return this.privileges;
      })
    );
  }

}
