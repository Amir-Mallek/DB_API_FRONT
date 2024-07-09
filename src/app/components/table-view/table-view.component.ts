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

  constructor(private manager: DbManagerService) {
  }

  ngOnChanges() {
    this.columns = this.manager.getColumns(this.schema, this.tableName);
    console.log(this.columns);
  }
}
