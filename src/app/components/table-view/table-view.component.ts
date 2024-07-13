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
  rowsToModify: number[] = [];
  rowsToDelete: boolean[] = [];

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
        this.rowsToModify = new Array(this.allRows.length).fill(0);
        this.rowsToDelete = new Array(this.allRows.length).fill(false);
      }
    );
  }

  handleModification(description: any) {
    this.rowsToModify[description.index] += description.change;
    if (this.rowsToModify[description.index]) {
      console.log('Row ' + description.index + ' is modified');
    }
  }

  deleteRows() {
    let primValues: any[] = [];
    for (let i = 0; i < this.allRows.length; i++) {
      if (this.rowsToDelete[i]) {
        primValues.push(this.allRows[i][this.primaryKey]);
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
        },
        error: (e) => {
          this.queryStatus = false;
          this.queryMessage = e.message;
        },
        complete: () => 1
      }
    );

  }

  goToInsert() {
    this.tableDescription.set(this.columns);
    this.router.navigate(['/insert', this.schema, this.tableName]).then();
  }

}
