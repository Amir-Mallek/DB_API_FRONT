import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {map} from "rxjs";

export const privilegesGuard: CanActivateFn = (route, state) => {
  const authentication = inject(AuthenticationService);
  const router = inject(Router);
  const segments: string[] = [];
  for (const segment of route.url) {
    segments.push(segment.path);
  }
  if (segments.length >= 2) {
    const schema = segments[0];
    const table = segments[1];
    const operation = (segments.length === 3) ? segments[2] : 'select';
    return authentication
      .getTablePrivileges(schema, table)
      .pipe(
        map((response) => {
          if (!response[operation.toUpperCase()]) {
            router.navigate([''], {
              queryParams: {
                schema: schema,
                table: table,
                operation: operation
              }
            }).then();
            return false;
          }
          return true;
        })
      );
  }
  return true;
};
