import {Component, Input} from '@angular/core';
import {SelectSchemaService} from "../../services/select-schema.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {DbConnectionService} from "../../services/db-connection.service";
import {SelectDto} from "../../model/dtos/SelectDto";


@Component({
  selector: 'app-schema-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './schema-item.component.html',
  styleUrl: './schema-item.component.css'
})
export class SchemaItemComponent {
  @Input() name = '';
  @Input() isSelected = false;

  constructor(
    private selectedSchema: SelectSchemaService,
    private router: Router,
    private dbc: DbConnectionService
  ) { }

  selectSchema() {
    this.router.navigate([this.name]).then(() => {});
    if (this.isSelected) return;
    this.selectedSchema.name.set(this.name);
  }

}
