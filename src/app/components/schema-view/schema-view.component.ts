import {Component, Input} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {Table} from "../../model/table";
import {DbManagerService} from "../../services/db-manager.service";
import {DatePipe} from "@angular/common";
import {TableSizePipe} from "../../pipes/table-size-pipe";
import {throwIfEmpty} from "rxjs";
import {Title} from "@angular/platform-browser";

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
    private router: Router,
    private title: Title
  ) { }

  ngOnChanges() {
    this.title.setTitle(this.schema);
    this.manager.getTables(this.schema).subscribe(
      (response) => {
        this.tables = response;
      }
    );
  }

  selectTable(tableName: string) {
    this.router.navigate([this.schema, tableName]).then(() => {});
  }
}
