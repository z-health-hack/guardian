import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AUTH_URL} from '../endpoints';
import {AuthRequest, AuthToken} from './auth.model';

const LOCAL_STORAGE_ACCESS_TOKEN = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  private static setAccessToken(accessToken: string): void {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
  }

  private static removeToken(): void {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
  }

  public authenticate(username: string, password: string): Observable<AuthToken> {
    return this.httpClient
      .post<AuthToken>(AUTH_URL, new AuthRequest(username, password))
      .pipe(
        tap(token => {
          AuthService.setAccessToken(token.token);
        })
      );
  }

  getAccessToken(): string {
    return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
  }

  get isLoggedIn(): boolean {
    return this.getAccessToken() != null;
  }

  logout(): void {
    AuthService.removeToken();
  }
}
