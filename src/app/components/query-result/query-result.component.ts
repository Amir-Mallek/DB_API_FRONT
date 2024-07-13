import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-query-result',
  standalone: true,
  imports: [],
  templateUrl: './query-result.component.html',
  styleUrl: './query-result.component.css'
})
export class QueryResultComponent {
  @Input() success = false;
  @Input() message = '';
}
