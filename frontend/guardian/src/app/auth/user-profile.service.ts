import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {UserProfile} from './auth.model';
import {USER_PROFILE_URL} from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private user$: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>(null);

  constructor(private httpClient: HttpClient) {
  }

  fetchUserProfile(): void {
    this.httpClient.get<UserProfile>(USER_PROFILE_URL)
      .pipe(tap(user => {
        this.user$.next(user);
      })).subscribe();
  }

  public get userProfile$(): Observable<UserProfile> {
    return this.user$.asObservable().pipe(filter(x => x !== null));
  }

  public removeUserProfile(): void {
    this.user$.next(null);
  }
}
