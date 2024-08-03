import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {QueryResultComponent} from "../query-result/query-result.component";
import {DbConnectionService} from "../../services/db-connection.service";
import {SelectResponse} from "../../model/response/SelectResponse";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    QueryResultComponent,
    JsonPipe
  ],
  templateUrl: './console.component.html',
  styleUrl: './console.component.css'
})
export class ConsoleComponent {
  @ViewChild('console') console!: ElementRef<HTMLTextAreaElement>;
  sql: FormControl = new FormControl('');
  queryResult: boolean = true;
  queryMessage: string = '';
  data: any;
  showData: boolean = false;
  history: string[] = [];
  currentPos: number = 0;
  currentSql: string = '';

  constructor(private dbc: DbConnectionService) { }

  onExecute() {
    this.dbc.execute(this.sql.value)
      .subscribe(res => {
        this.history.push(this.sql.value);
        this.sql.setValue('');
        this.currentPos = this.history.length;
        this.currentSql = '';

        this.showData = false;
        this.data = [];
        if (res.status == 'SUCCESS') {
          this.queryResult = true;
          this.queryMessage = res.message;
          if ((res as SelectResponse).data) {
            this.showData = true;
            this.data = (res as SelectResponse).data;
          }
        } else {
          this.queryResult = false;
          this.queryMessage = res.message;
        }
      });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.changeConsoleContent(true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.changeConsoleContent(false);
    } else if (event.ctrlKey && event.key === 'Enter') {
      this.onExecute();
    }
  }

  getKeys(row: any) {
    return Object.keys(row);
  }

  changeConsoleContent(up: boolean) {
    if (up) {
      if (this.currentPos > 0) {
        this.currentPos--;
        this.sql.setValue(this.history[this.currentPos]);
        const sqlLength = this.history[this.currentPos].length;
        this.console.nativeElement.setSelectionRange(sqlLength, sqlLength);
      }
    } else {
      if (this.currentPos < this.history.length-1) {
        this.currentPos++;
        this.sql.setValue(this.history[this.currentPos]);
        const sqlLength = this.history[this.currentPos].length;
        this.console.nativeElement.setSelectionRange(sqlLength, sqlLength);
      } else if (this.currentPos === this.history.length-1) {
        this.currentPos++;
        this.sql.setValue(this.currentSql);
        const sqlLength = this.currentSql.length;
        this.console.nativeElement.setSelectionRange(sqlLength, sqlLength);
      }
    }

  }

}
