import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AUTH_STATE, AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.checkLogin(true).pipe(map((authState: AUTH_STATE) => {
      // If the user is trying to access "Login" page while he is already logged in or the
      // auth is disabled, redirect him to "Nodes" page
      if (route.routeConfig.path === 'login' && (authState === AUTH_STATE.LOGIN_OK || authState === AUTH_STATE.AUTH_DISABLED)) {
        this.router.navigate(['nodes']);

        return false;
      }

      // If the user is trying to access protected part of the application while not logged in,
      // redirect him to "Login" page
      if (route.routeConfig.path !== 'login' && authState === AUTH_STATE.LOGIN_FAIL) {
        this.router.navigate(['login']);
        this.matDialog.closeAll();

        return false;
      }

      // If the server wants the user to change his password
      // allow him to go to "Change password" page
      // and deny him to go anywhere else
      if (authState === AUTH_STATE.CHANGE_PASSWORD) {
        if (route.routeConfig.path === 'settings/password') {
          return true;
        } else {
          this.router.navigate(['settings/password']);

          return false;
        }
      }

      return true;
    }));
  }
}
