import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {UserProfile} from './auth/auth.model';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {UserProfileService} from './auth/user-profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'guardian';
  userProfile$: Observable<UserProfile>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userProfileService: UserProfileService,
  ) {
    this.userProfile$ = userProfileService.userProfile$;
    userProfileService.fetchUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.userProfileService.removeUserProfile();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }
}
