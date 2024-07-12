import {Component, Input} from '@angular/core';
import {DbManagerService} from "../../services/db-manager.service";
import {CellComponent} from "../cell/cell.component";
import {Column} from "../../model/column";

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CellComponent
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css'
})
export class TableViewComponent {
  @Input() schema = '';
  @Input() tableName = '';
  columns: Column[] = [];
  allRows: Record<string, any>[] = [];
  rowIsModified: number[] = [];
  rowIsDeleted: number[] = [];

  constructor(private manager: DbManagerService) { }

  ngOnChanges() {
    this.manager.getTableDescription(this.schema, this.tableName).subscribe(
      (response) => {
        this.columns = response;
      }
    );

    this.manager.getAllRows(this.schema, this.tableName).subscribe(
      (response) => {
        this.allRows = response;
        this.rowIsModified = new Array(this.allRows.length).fill(0);
      }
    );
  }

  handleModification(description: any) {
    this.rowIsModified[description.index] += description.change;
    if (this.rowIsModified[description.index]) {
      console.log('Row ' + description.index + ' is modified');
    }
  }

  getRowClass(index: number) {
    if (this.rowIsModified[index]) return 'modified';
    return ''
  }
}
