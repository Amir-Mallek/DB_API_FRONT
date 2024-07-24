import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";

export const authGuard: CanActivateFn = (route  , state) => {
  const authentication = inject(AuthenticationService);
  if (authentication.isAuthenticated()) {
    return true;
  }
  authentication.handleUnauthorized(state.url);
  return false;
};
