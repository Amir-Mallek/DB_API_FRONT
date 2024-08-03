import { Component } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {SelectSchemaService} from "../../services/select-schema.service";
import {ActivatedRoute} from "@angular/router";
import {ConsoleComponent} from "../console/console.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ConsoleComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  username = ''
  unauthedSchema = '';
  unauthedTable = '';
  unauthedOp = '';
  unauthorized = false;

  constructor(
    private authentication: AuthenticationService,
    private selectedSchema: SelectSchemaService,
    private route: ActivatedRoute
  ) {
    this.username = authentication.getUsername();
  }

  ngOnInit() {
    this.selectedSchema.set('');

    this.route.queryParams.subscribe(
      (params) => {
        this.unauthedSchema = params['schema'] || '';
        this.unauthedTable = params['table'] || '';
        this.unauthedOp = params['operation'] || '';
        if (this.unauthedSchema !== '') {
          this.unauthorized = true;
        }
      });
  }

  logout() {
    this.authentication.logout();
  }
}
