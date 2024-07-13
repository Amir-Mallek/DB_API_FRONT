import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'inputType',
  standalone: true
})
export class InputTypePipe implements PipeTransform {
  transform(type: string): string {
    if (type == 'date' || type == 'time')  return type;
    if (type == 'datetime') return 'datetime-local';
    return 'text';
  }
}
