import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTypePipe} from "../../pipes/input-type-pipe";

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTypePipe
  ],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {
  @Input() originalValue: string = '';
  @Input() type: string = 'text';

  constructor() { }

}
