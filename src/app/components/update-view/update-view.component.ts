import {Component, Input} from '@angular/core';
import {Column} from "../../model/column";
import {TableDescriptionService} from "../../services/table-description.service";
import {DbManagerService} from "../../services/db-manager.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputTypePipe} from "../../pipes/input-type-pipe";
import {QueryResultComponent} from "../query-result/query-result.component";
import {RouterLink} from "@angular/router";
import {OperandComponent} from "../operand/operand.component";
import {Operand} from "../../model/where/operand";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-update-view',
  standalone: true,
  imports: [
    InputTypePipe,
    QueryResultComponent,
    ReactiveFormsModule,
    RouterLink,
    OperandComponent
  ],
  templateUrl: './update-view.component.html',
  styleUrl: './update-view.component.css'
})
export class UpdateViewComponent {
  @Input() schema = '';
  @Input() table = '';
  columns: Column[] = [];
  updateForm: FormGroup = new FormGroup({});
  where: Operand;
  queryStatus: boolean = false;
  queryMessage: string = '';

  constructor(
    private tableDescription: TableDescriptionService,
    private manager: DbManagerService,
    private title: Title
  ) {
    this.where = new Operand();
    this.where.type = 'condition'
  }

  ngOnChanges() {
    this.title.setTitle('Update ' + this.schema + '.' + this.table);

    this.tableDescription.columns.subscribe(
      (response) => {
        if (response.length == 0) {
          this.manager.getTableDescription(this.schema, this.table).subscribe(
            (response) => {
              this.columns = response;
              this.setFormControls();
            }
          );
        } else {
          this.columns = response;
          this.setFormControls();
        }
      }
    );
  }

  private setFormControls(): void {
    let groupControls: Record<string, FormControl> = {};
    for (let column of this.columns) {
      groupControls[column.name] = new FormControl('');
      groupControls[column.name+'-checkbox'] = new FormControl(true);
    }
    this.updateForm = new FormGroup(groupControls);
  }

  onSubmit() {
    let mods: Record<string, any> = {};
    for (let column of this.columns) {
      if (this.updateForm.value[column.name+'-checkbox']) {
        mods[column.name] = this.updateForm.value[column.name];
      }
    }

    this.manager.updateValues(this.schema, this.table, mods, this.where).subscribe(
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
}
