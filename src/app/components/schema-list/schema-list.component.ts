import {Component} from '@angular/core';
import {SchemaItemComponent} from "../schema-item/schema-item.component";
import {SelectSchemaService} from "../../services/select-schema.service";
import {DbManagerService} from "../../services/db-manager.service";

@Component({
  selector: 'app-schema-list',
  standalone: true,
  imports: [
    SchemaItemComponent
  ],
  templateUrl: './schema-list.component.html',
  styleUrl: './schema-list.component.css'
})
export class SchemaListComponent {
  schemas: string[] = [];

  constructor(
    private selectedSchema: SelectSchemaService,
    private manager: DbManagerService
  ) { }

  ngOnInit() {
    this.manager.getSchemas().subscribe(
      (response) => {
        this.schemas = response;
      }
    );
  }

  getSelectedSchema() {
    return this.selectedSchema.name();
  }
}
