import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {
  @Input() originalValue: string = '';
  @Input() type: string = 'text';
  @Input() index: number = 0;
  @Output() isModified = new EventEmitter();
  value: string = '';
  isExpanded: boolean = false;
  wasSame: Boolean = true;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges() {
    this.value = this.originalValue;
  }

  expandInput() {
    this.isExpanded = true;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.isExpanded) return;
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isExpanded = false;
      this.handleChange();
    }
  }

  handleChange() {
    if (this.value != this.originalValue) {
      this.isModified.emit({
        index: this.index,
        change: (this.wasSame) ? -1 : 0
      });
      this.wasSame = false;
    } else {
      this.isModified.emit({
        index: this.index,
        change: (this.wasSame) ? 0 : 1
      });
      this.wasSame = true;
    }
  }

}
