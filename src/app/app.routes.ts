import { Routes } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { SchemaViewComponent } from "./components/schema-view/schema-view.component";
import {TableViewComponent} from "./components/table-view/table-view.component";
import {InsertViewComponent} from "./components/insert-view/insert-view.component";
import {UpdateViewComponent} from "./components/update-view/update-view.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./components/login/login.component";
import {authGuard} from "./guards/auth.guard";
import {privilegesGuard} from "./guards/privileges.guard";

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent
  },
  {
    path: '',
    title: 'Dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard, privilegesGuard],
    children: [
      {
        path: '',
        title: 'Home',
        component: HomePageComponent
      },
      {
        path: 'insert/:schema/:table',
        title: 'insert',
        component: InsertViewComponent
      },
      {
        path: 'update/:schema/:table',
        title: 'update',
        component: UpdateViewComponent
      },
      {
        path: ':schema',
        component: SchemaViewComponent,
        title: 'schema',
      },
      {
        path: ':schema/:tableName',
        title: 'table',
        component: TableViewComponent
      }
    ]
  }
];
