import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SchemaListComponent} from "../schema-list/schema-list.component";
import {HomePageComponent} from "../home-page/home-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SchemaListComponent,
    HomePageComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['login']).then();
  }

}
