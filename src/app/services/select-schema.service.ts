import {Injectable, signal} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SelectSchemaService {
  private schemaSubject = new BehaviorSubject<string>('');
  observable = this.schemaSubject.asObservable();

  set(schema: string) {
    this.schemaSubject.next(schema);
  }
}
