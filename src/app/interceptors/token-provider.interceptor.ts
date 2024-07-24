import { HttpInterceptorFn } from '@angular/common/http';

export const tokenProviderInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    const authedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authedReq);
  }
  return next(req);
};
