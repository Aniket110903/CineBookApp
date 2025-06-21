import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastService } from '../Toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class GuestAuthGuardService {

  constructor(private _router: Router, private toastService: ToastService) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    //check condition
    const user = sessionStorage.getItem("user");
    if (user == null) {
      this.toastService.showError("You are not allowed to view to page!");
      this._router.navigate(['']);
      return false;
    }
    return true;
  }
}
