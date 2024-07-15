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

  constructor(
    private tableDescription: TableDescriptionService,
    private manager: DbManagerService
  ) {
    this.where = new Operand();
    this.where.type = 'condition'
  }

  ngOnInit() {
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
    console.log(this.where);
  }
}
