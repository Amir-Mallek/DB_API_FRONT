import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'tableSize',
  standalone: true
})
export class TableSizePipe implements PipeTransform {
  transform(value: number): any {
    value /= 1024;
    if (value < 1024) {
      return value.toFixed(2) + ' kB';
    }
    return (value/1024).toFixed(2) + ' MB';
  }
}
