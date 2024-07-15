import {Component, Input} from '@angular/core';
import {Column} from "../../model/column";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {WhereEncoderService} from "../../services/where-encoder.service";
import {Operand} from "../../model/where/operand";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-operand',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './operand.component.html',
  styleUrl: './operand.component.css'
})
export class OperandComponent {
  @Input() columns: Column[] = [];
  @Input() type: string = 'col';
  @Input() nb: number = 1;
  @Input() operand: Operand = new Operand();

  op1: Operand = new Operand();
  op2: Operand = new Operand();

  operandType1: FormControl = new FormControl('col');
  operandType2: FormControl = new FormControl('val');
  valType: FormControl = new FormControl('text');

  col: FormControl = new FormControl('');
  val: FormControl = new FormControl('');
  operator: FormControl = new FormControl('');

  operators: string[] = ['', '=', '!=', '>', '<', '>=', '<=', 'LIKE', 'AND', 'OR'];
  isHovered: boolean = false;
  isCollapsed: boolean = false;

  private colSubscription: Subscription;
  private valSubscription: Subscription;
  private condSubscription: Subscription;

  constructor(private whereEncoder: WhereEncoderService) {
    this.colSubscription = this.col.valueChanges.subscribe(
      (name) => {
        this.operand.name = name;
      });
    this.valSubscription = this.val.valueChanges.subscribe(
      (value) => {
        this.operand.value = value;
      });
    this.condSubscription = this.operator.valueChanges.subscribe(
      (operator) => {
        this.operand.operator = operator;
      });
  }

  ngOnInit() {
    this.operand.op1 = this.op1;
    this.operand.op2 = this.op2;
  }

  ngOnChanges() {
    switch (this.type) {
      case 'col':
        this.operand.type = 'column';
        break;
      case 'val':
        this.operand.type = 'value';
        break;
      case 'cond':
        this.operand.type = 'condition';
        break;
    }
  }

  ngOnDestroy() {
    this.colSubscription.unsubscribe();
    this.valSubscription.unsubscribe();
    this.condSubscription.unsubscribe();
  }

}
