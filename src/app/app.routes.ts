import { Routes } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { SchemaViewComponent } from "./components/schema-view/schema-view.component";
import {TableViewComponent} from "./components/table-view/table-view.component";

export const routes: Routes = [
  {
    path: '',
    title: 'DB-Admin',
    component: HomePageComponent
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
