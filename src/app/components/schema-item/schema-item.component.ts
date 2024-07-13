import {Component, Input} from '@angular/core';
import {SelectSchemaService} from "../../services/select-schema.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";

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
  isSelected: boolean = false;

  constructor(
    private selectedSchema: SelectSchemaService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.selectedSchema.observable.subscribe(
      (schema) => {
        this.isSelected = (schema === this.name);
      }
    );
  }

  selectSchema() {
    this.selectedSchema.set(this.name);
    this.router.navigate([this.name]).then(() => {});
  }

}
