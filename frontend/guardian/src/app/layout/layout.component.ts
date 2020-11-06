import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {UserProfile} from '../auth/auth.model';
import {Observable} from 'rxjs';
import {UserProfileService} from '../auth/user-profile.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  userProfile$: Observable<UserProfile>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userProfileService: UserProfileService,
  ) {
    this.userProfile$ = userProfileService.userProfile$;
  }

  logout(): void {
    this.authService.logout();
    this.userProfileService.removeUserProfile();
    this.router.navigate(['/login']);
  }
}
