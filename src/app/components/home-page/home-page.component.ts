import { Component } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {SelectSchemaService} from "../../services/select-schema.service";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  username = ''

  constructor(
    private authentication: AuthenticationService,
    private selectedSchema: SelectSchemaService
  ) {
    this.username = authentication.getUsername();
  }

  ngOnInit() {
    this.selectedSchema.set('');
  }

  logout() {
    this.authentication.logout();
  }
}
