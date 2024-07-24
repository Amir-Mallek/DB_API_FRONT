import { HttpInterceptorFn } from '@angular/common/http';
import {catchError} from "rxjs";
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";

export const unauthorizedRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const authentication = inject(AuthenticationService);
  return next(req).pipe(
    catchError((error) => {
      console.warn('saret mochkla');
      if (error.status === 401 && authentication.inLoginOperation) {
        authentication.inLoginOperation = false;
      } else if (error.status === 401) {
        authentication.handleUnauthorized();
      }
      throw new Error(error['message']);
    })
  );
};
