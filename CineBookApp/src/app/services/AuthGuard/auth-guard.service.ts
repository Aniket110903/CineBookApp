import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastService } from '../Toast/toast.service';
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _router: Router, private toastService: ToastService) {
  }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    //check condition
    const user = sessionStorage.getItem("user");
    if (user == null) {
      this.toastService.showError("You are not allowed to view to page!");
      //return false to cancel the navigation
      this._router.navigate(['']);
      return false;
    } else if (user != null) {
      const parsed = JSON.parse(user);
      if (parsed.role != "Admin") {
        this.toastService.showError("You are not allowed to view to page!");
        this._router.navigate(['']);
        return false;
      }
    }

    return true;
  }
}
