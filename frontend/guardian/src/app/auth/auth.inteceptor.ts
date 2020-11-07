import {Injectable} from '@angular/core';

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  private static cloneRequestWithAccessToken(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: 'Token ' + accessToken,
        'Cache-Control': 'no-cache'
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAccessToken();
    const clonedReq = AuthInterceptor.cloneRequestWithAccessToken(request, authToken);
    return next.handle(clonedReq);
  }

  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
