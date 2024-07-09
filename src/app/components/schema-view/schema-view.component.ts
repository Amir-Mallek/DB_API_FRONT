import {Component, Input} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {Table} from "../../model/Table";
import {DbManagerService} from "../../services/db-manager.service";
import {DatePipe} from "@angular/common";
import {TableSizePipe} from "../../pipes/table-size-pipe";
import {throwIfEmpty} from "rxjs";

@Component({
  selector: 'app-schema-view',
  standalone: true,
  imports: [
    RouterOutlet,
    DatePipe,
    TableSizePipe
  ],
  templateUrl: './schema-view.component.html',
  styleUrl: './schema-view.component.css'
})
export class SchemaViewComponent {
  @Input() schema = '';
  tables: Table[] = [];

  constructor(
    private manager: DbManagerService,
    private router: Router
  ) { }

  ngOnChanges() {
    this.tables = this.manager.getTables(this.schema);
  }

  selectTable(tableName: string) {
    this.router.navigate([this.schema, tableName]).then(() => {});
  }
}
