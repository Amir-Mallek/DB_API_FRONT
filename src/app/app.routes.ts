import { Routes } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { SchemaViewComponent } from "./components/schema-view/schema-view.component";
import {TableViewComponent} from "./components/table-view/table-view.component";
import {InsertViewComponent} from "./components/insert-view/insert-view.component";
import {UpdateViewComponent} from "./components/update-view/update-view.component";

export const routes: Routes = [
  {
    path: '',
    title: 'DB-Admin',
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
    title: 'Schema',
  },
  {
    path: ':schema/:tableName',
    title: 'table',
    component: TableViewComponent
  }
];
