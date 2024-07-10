import {Component, Input} from '@angular/core';
import {DbManagerService} from "../../services/db-manager.service";

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css'
})
export class TableViewComponent {
  @Input() schema = '';
  @Input() tableName = '';
  columns: string[] = [];
  allRows: any[] = [];

  constructor(private manager: DbManagerService) { }

  ngOnChanges() {
    this.manager.getColumns(this.schema, this.tableName).subscribe(
      (response) => {
        for (let row of response.data) {
          this.columns.push(row['COLUMN_NAME']);
        }
      }
    );
    this.manager.getAllRows(this.schema, this.tableName).subscribe(
      (response) => {
        this.allRows = response.data;
      }
    );
  }

}
