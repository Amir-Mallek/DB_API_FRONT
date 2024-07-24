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
    const schema = (segments.length === 3) ? segments[1] : segments[0];
    const table = (segments.length === 3) ? segments[2] : segments[1];
    const operation = (segments.length === 3) ? segments[0] : 'select';
    return authentication
      .getTablePrivileges(schema, table)
      .pipe(
        map((response) => {
          if (!response[operation.toUpperCase()]) {
            router.navigate([]).then();
            return false;
          }
          return true;
        })
      );
  }
  return true;
};
