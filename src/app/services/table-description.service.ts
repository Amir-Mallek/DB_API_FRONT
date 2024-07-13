import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Column} from "../model/column";

@Injectable({
  providedIn: 'root'
})
export class TableDescriptionService {
  private tableDescription = new BehaviorSubject<Column[]>([]);
  columns = this.tableDescription.asObservable();

  constructor() { }

  set(description: Column[]) {
    this.tableDescription.next(description);
  }
}
