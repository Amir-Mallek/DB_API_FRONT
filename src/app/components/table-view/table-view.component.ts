import {Component, Input} from '@angular/core';
import {DbManagerService} from "../../services/db-manager.service";
import {CellComponent} from "../cell/cell.component";
import {Column} from "../../model/column";
import {NgClass} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {TableDescriptionService} from "../../services/table-description.service";
import {QueryResultComponent} from "../query-result/query-result.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Title} from "@angular/platform-browser";
import {SelectSchemaService} from "../../services/select-schema.service";
import {DbConnectionService} from "../../services/db-connection.service";
import {SelectResponse} from "../../model/response/SelectResponse";

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CellComponent,
    NgClass,
    RouterLink,
    QueryResultComponent,
    ReactiveFormsModule
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css'
})
export class TableViewComponent {
  @Input() schema = '';
  @Input() tableName = '';
  columns: Column[] = [];
  primaryKey: string = '';
  allRows: Record<string, any>[] = [];
  nbRows: FormControl = new FormControl(0);
  tablePrivileges: Record<string, boolean> = {};

  consoleIsCollapsed: boolean = false;
  whereClause: FormControl = new FormControl('');

  queryStatus: boolean = false;
  queryMessage: string = '';

  constructor(
    private manager: DbManagerService,
    private dbc: DbConnectionService,
    private router: Router,
    private tableDescription: TableDescriptionService,
    private authentication: AuthenticationService,
    private title: Title,
    private selectedSchema: SelectSchemaService
  ) { }

  ngOnChanges() {
    this.title.setTitle(this.schema + '.' + this.tableName);
    this.selectedSchema.set(this.schema);

    this.tableDescription
      .getColumns(this.schema, this.tableName)
      .subscribe(
        (response) => {
          this.columns = response;
          let primColumn = this.columns.find(column => column.isKey);
          if (primColumn) {
            this.primaryKey = primColumn.name;
          }
        }
      );

    this.fetchRows(100);

    this.authentication
      .getTablePrivileges(this.schema, this.tableName)
      .subscribe(
        (response) => {
          this.tablePrivileges = response
        }
      );
  }

  fetchRows(limit: number) {
    this.manager.getAllRows(this.schema, this.tableName, limit).subscribe(
      {
        next: (r) => {
          this.assignNewRows(r);
        },
        error: (e) => {
          this.queryStatus = false;
          this.queryMessage = e.message;
        },
        complete: () => 1
      }
    );
  }

  deleteRows() {
    let primValues: any[] = [];
    for (let row of this.allRows) {
      if (row['toDelete']) {
        primValues.push(row[this.primaryKey]);
      }
    }

    if (primValues.length === 0) {
      this.queryStatus = false;
      this.queryMessage = 'No row selected.';
      return;
    }

    this.manager.deleteRows(
      this.schema,
      this.tableName,
      primValues,
      this.primaryKey
    ).subscribe(
      {
        next: (r) => {
          this.queryStatus = true;
          this.queryMessage = r.message + ". " + r.affectedRows + ' row(s) affected.';
          let newRows: Record<string, any>[] = [];
          for (let row of this.allRows) {
            if (!row['toDelete']) {
              newRows.push(row);
            }
          }
          this.allRows = newRows;
        },
        error: (e) => {
          this.queryStatus = false;
          this.queryMessage = e.message;
        },
        complete: () => 1
      }
    );

  }

  goTo(destination: string) {
    this.router.navigate([destination, this.schema, this.tableName]).then();
  }

  onFetch() {
    let sql = `SELECT * from \`${this.schema}\`.\`${this.tableName}\` WHERE `;
    sql += this.whereClause.value;
    this.dbc.execute(sql)
      .subscribe(res => {
        if (res.status == 'SUCCESS') {
          if ((res as SelectResponse).data) {
            this.assignNewRows((res as SelectResponse).data);
          } else {
            this.assignNewRows([]);
          }
        } else {
          this.queryStatus = false;
          this.queryMessage = res.message;
        }
      });
    this.consoleIsCollapsed = false;
  }

  assignNewRows(newRows: any[]) {
    this.allRows = newRows;
    this.queryStatus = true;
    this.queryMessage = newRows.length + ' row(s) fetched.';
    for (let row of this.allRows) {
      row['toDelete'] = false;
    }
    this.nbRows.setValue(this.allRows.length);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.onFetch();
    }
  }

}
