import {Component, Input} from '@angular/core';
import {DbManagerService} from "../../services/db-manager.service";
import {CellComponent} from "../cell/cell.component";
import {Column} from "../../model/column";
import {NgClass} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {TableDescriptionService} from "../../services/table-description.service";
import {QueryResultComponent} from "../query-result/query-result.component";

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CellComponent,
    NgClass,
    RouterLink,
    QueryResultComponent
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

  queryStatus: boolean = false;
  queryMessage: string = '';

  constructor(
    private manager: DbManagerService,
    private router: Router,
    private tableDescription: TableDescriptionService
  ) { }

  ngOnChanges() {
    this.manager.getTableDescription(this.schema, this.tableName).subscribe(
      (response) => {
        this.columns = response;
        let primColumn = this.columns.find(column => column.isKey);
        if (primColumn) {
          this.primaryKey = primColumn.name;
        }
      }
    );

    this.manager.getAllRows(this.schema, this.tableName).subscribe(
      (response) => {
        this.allRows = response;
        for (let row of this.allRows) {
          row['toDelete'] = false;
        }
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
    this.tableDescription.set(this.columns);
    this.router.navigate([destination, this.schema, this.tableName]).then();
  }

}
